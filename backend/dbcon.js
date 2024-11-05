require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql'); // Ensure mysql is required

// Create the connection to the MySQL database
const db = mysql.createConnection({
    host: process.env.DB_HOST,       // Use the DB_HOST from .env
    user: process.env.DB_USER,       // Use the DB_USER from .env
    password: process.env.DB_PASSWORD,// Use the DB_PASSWORD from .env
    database: process.env.DB_NAME     // Use the DB_NAME from .env
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Export the db connection
module.exports = db;
