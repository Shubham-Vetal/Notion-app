const Note = require('../models/note.js');

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content, type, recordedTime } = req.body;

    if (!title || !content || !type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // If type is 'audio', ensure recordedTime is included
    if (type === 'audio' && !recordedTime) {
      return res.status(400).json({ message: 'Recorded time is required for audio notes' });
    }

    const newNote = new Note({ 
      title, 
      content, 
      type, 
      recordedTime: type === 'audio' ? recordedTime : 0 // Set recordedTime to 0 for non-audio notes
    });
    await newNote.save();

    res.status(201).json({ message: 'Note created successfully', note: newNote });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ timestamp: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Fetch a note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update a Note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body; // Accept fields to update

    const updatedNote = await Note.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Upload an Image for a Note
const uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!imageUrl) return res.status(400).json({ message: 'No image uploaded' });

    const updatedNote = await Note.findByIdAndUpdate(id, { imageUrl }, { new: true });

    if (!updatedNote) return res.status(404).json({ message: 'Note not found' });

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Toggle the favorite status of a note
const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the note by ID and toggle the isFavorite value
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isFavorite = !note.isFavorite;  // Toggle the favorite status
    await note.save();  // Save the updated note

    res.status(200).json(note);  // Send back the updated note
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { 
  createNote, 
  getAllNotes, 
  getNoteById, // Export the new function
  deleteNote, 
  updateNote, 
  uploadImage, 
  toggleFavorite 
};
