//database/db.js

import mysql from 'mysql2/promise'; 

// Create a connection pool

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'jay_pdm',
});


// const db = mysql.createPool({
//   host: '127.0.0.1',
//   user: 'dzmbjxtk_pdm_new',
//   password: 'dzmbjxtk_pdm_new',
//   database: 'dzmbjxtk_pdm_new',
// });

// Connect to the database
const connectToDatabase = async () => {
  try {
    await db.getConnection();
    console.log('Connected to MySQL database');
  } catch (err) {
    console.error('Error connecting to MySQL database:', err);
  }
};

connectToDatabase();

export default db; 