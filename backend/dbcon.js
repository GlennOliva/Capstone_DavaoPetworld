require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql'); // Ensure mysql is required

// Create the connection to the MySQL database
const db = mysql.createConnection({
    host: process.env.DB_HOST,       // Use the DB_HOST from .env
    user: process.env.DB_USER,       // Use the DB_USER from .env
    password: process.env.DB_PASSWORD,// Use the DB_PASSWORD from .env
    database: process.env.DB_NAME,   // Use the DB_NAME from .env
    multipleStatements: true         // This allows for multiple queries in a single statement
});

// Function to establish the connection and handle retries
function connectToDatabase() {
    db.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);

            // Retry if connection is lost
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log('MySQL connection lost. Attempting to reconnect...');
                setTimeout(connectToDatabase, 5000); // Retry after 5 seconds
            } else {
                // Handle other errors or exit the application if necessary
                process.exit(1);
            }
        } else {
            console.log('Connected to the MySQL database');
        }
    });
}

// Initialize connection
connectToDatabase();

// Handle disconnections gracefully
db.on('error', (err) => {
    console.error('MySQL error:', err.code);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // Reconnect if connection is lost
        connectToDatabase();
    } else {
        // Handle other errors here if necessary
        console.error('Database error:', err.message);
    }
});

// Export the db connection
module.exports = db;
