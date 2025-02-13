const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const noteRoutes = require('./routes/note.routes');

dotenv.config();
connectToDb();

const app = express();

// Middleware setup
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); // Set the limit for JSON payloads to 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Set the limit for URL-encoded payloads to 10MB

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Routes
app.use('/users', userRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app;
