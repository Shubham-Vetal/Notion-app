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

const router = express.Router();

// Route to create a new note
router.post('/create', createNote);

// Route to get all notes
router.get('/', getAllNotes);

// Route to fetch a note by its ID
router.get('/:id', getNoteById);

// Route to delete a note by ID
router.delete('/:id', deleteNote);

// Route to update a note by ID
router.put('/:id', updateNote);

// Route to upload an image for a note
router.put('/upload-image/:id', upload.single('image'), uploadImage);

// Route to toggle the favorite status of a note
router.patch('/:id/toggle-favorite', toggleFavorite);

module.exports = router;
