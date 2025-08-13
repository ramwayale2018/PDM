// models/userModel.js

import db from '../database/db.js';


export const addUser = async (user) => {
  const query = 'INSERT INTO users (name, contact_no, email, address, role, status, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const [result] = await db.query(query, user);
  return result;
};







export const getUsers = async () => {
  const query = 'SELECT id, name, contact_no, email, address, role, username, password, status FROM users ORDER BY id DESC';
  const [rows] = await db.query(query);
  return rows;
};







export const editUser = async (id, user) => {
  const query = `
    UPDATE users SET name = ?, contact_no = ?, address = ?, email = ?, role = ?, status = ?
    WHERE id = ?`;
  const [result] = await db.query(query, [user.name, user.contact, user.address, user.email, user.role, user.status, id]);
  return result;
};


export const deleteUser = async (id) => {
  const query = 'DELETE FROM users WHERE id = ?';
  const [result] = await db.query(query, [id]);
  return result;
};


export const updateUserPassword = async (userId, hashedPassword) => {
  const query = 'UPDATE users SET password = ? WHERE id = ?';
  const [result] = await db.query(query, [hashedPassword, userId]);
  return result;
};