const express = require('express');
const upload = require('../middlewares/upload');
const { 
  createNote, 
  getAllNotes, 
  getNoteById, 
  deleteNote, 
  updateNote, 
  uploadImage, 
  toggleFavorite 
} = require('../controllers/noteController');
const { authUser } = require('../middlewares/auth.middleware');  // Make sure to include this

const router = express.Router();

// Route to create a new note
router.post('/', authUser, createNote);  // Add authUser middleware to ensure user is authenticated

// Route to get all notes
router.get('/', authUser, getAllNotes);  // Add authUser middleware to ensure user is authenticated

// Route to fetch a note by its ID
router.get('/:id', authUser, getNoteById);  // Add authUser middleware to ensure user is authenticated

// Route to delete a note by ID
router.delete('/:id', authUser, deleteNote);  // Add authUser middleware to ensure user is authenticated

// Route to update a note by ID
router.put('/:id', authUser, updateNote);  // Add authUser middleware to ensure user is authenticated

// Route to upload an image for a note (use PATCH if updating an existing note)
router.patch('/upload-image/:id', authUser, upload.single('image'), uploadImage);  // Add authUser middleware to ensure user is authenticated

// Route to toggle the favorite status of a note
router.patch('/:id/toggle-favorite', authUser, toggleFavorite);  // Add authUser middleware to ensure user is authenticated

module.exports = router;
