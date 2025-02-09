const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
const express = require('express');
const connectToDb = require('./db/db');

dotenv.config();
connectToDb();

const app = express();

app.use(cors()); 
app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/user.routes');
app.use('/users', userRoutes);

const noteRoutes = require('./routes/note.routes');
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.send("Hello World");
});

module.exports = app;
