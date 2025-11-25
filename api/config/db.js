// backend/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables (like DB_HOST, DB_USER, etc.)

// console.log({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT || 3306, // Use port from .env or default to 3306
//     waitForConnections: true,
//     connectionLimit: 10, // Adjust as needed for your expected load
//     queueLimit: 0,
//     charset: 'utf8mb4'
// })
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Use port from .env or default to 3306
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed for your expected load
    queueLimit: 0,
    charset: 'utf8mb4'
});

// Optional: Test the connection pool immediately on startup
// Note: This is non-fatal - the app will continue to run even if the initial test fails
// The connection pool will retry when actually used
pool.getConnection()
  .then(connection => {
    console.log('MySQL connection pool created and tested successfully xxx from db.js!');
    connection.release(); // Release the connection immediately after testing
  })
  .catch(err => {
    console.error('Warning: Initial database connection test failed from db.js:', err.message);
    console.error('The application will continue to run. Database connections will be retried when needed.');
    // Don't exit - let the app start and retry connections when actually used
    // This is especially important in Docker environments where the DB might not be ready immediately
  });

module.exports = pool; // This is the crucial line: Export the pool for other files to use