
// server/controllers/userController.js
import {
  addUser,
  getUsers as getAllUsers,
  deleteUser,
  editUser,
  updateUserPassword 
} from '../models/userModel.js';
import db from '../database/db.js';
import bcrypt from 'bcrypt';
import xlsx from 'xlsx';
import fs from 'fs';

export const createUser = async (req, res) => {
  const { name, contact, email, address, role, status, username, password } = req.body;

  try {
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await addUser([
      name,
      contact,
      email,
      address,
      role,
      status,
      username,
      hashedPassword, 
    ]);

    res.status(201).json({ message: 'User added successfully!', id: result.insertId });
  } catch (error) {
    console.error(error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username already exists!' });
    }
    res.status(500).json({ error: 'An error occurred while adding the user.' });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error); 
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {  name, contact,address, email, role, status } = req.body;
  try {
    const result = await editUser(id, { name, contact, email, address, role, status});
    res.json({ message: 'User updated successfully', result });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};



export const removeUser = async (req, res) => {
  const { id } = req.params;
  const query = 'select name FROM users WHERE id = ?';
  const [result] = await db.query(query, [id]);

  try {
    const result = await deleteUser(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};



export const changePassword = async (req, res) => {
  console.log('Change password route hit');

  // Get the userId from the session
  const userId = req.session.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    // Fetch the user from the database
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate the current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password in the database
    await updateUserPassword(userId, hashedPassword);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};



export const importUsers = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      const { Name, 'Contact No': contact, Email, Address, Role, Status, Username, Password } = row;

      // Convert Password to string if it's a number
      const passwordString = String(Password);

      // Validate the password
      if (!passwordString || typeof passwordString !== 'string') {
        console.error(`Invalid password for user: ${Username}`);
        continue; // Skip this user
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(passwordString, saltRounds);

      // Add the user to the database
      await addUser([
        Name,
        contact,
        Email,
        Address,
        Role,
        Status,
        Username,
        hashedPassword,
      ]);
    }

    // Delete the temporary file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: 'Users imported successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while importing users.' });
  }
};



// export const userResetPassword = async (req, res) => {
//   const { id } = req.params;
//   const { newPassword } = req.body;

//   try {
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
//     await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
//     res.status(200).json({ message: 'Password updated successfully' });
//   } catch (err) {
//     console.error('Error resetting password:', err);
//     res.status(500).json({ message: 'Error resetting password' });
//   }
// }


export const userResetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ message: 'Password must be at least 4 characters' });
  }

  try {
    const [user] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};