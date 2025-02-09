require('dotenv').config();  // Load environment variables from .env file
const mongoose = require('mongoose');

function connectToDb() {
    const dbURI = process.env.DB_CONNECT;  // Use the DB_CONNECT value from .env

    mongoose.connect(dbURI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
}

module.exports = connectToDb;
