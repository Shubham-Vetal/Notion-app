const Note = require('../models/note.js');
const path = require('path');

// Create a new note
const createNote = async (req, res) => {
  try {
    console.log("User ID from token:", req.user);

    const { title, content, type, recordedTime } = req.body;
    const userId = req.user._id;

    if (!title || !content || !type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (type === 'audio' && !recordedTime) {
      return res.status(400).json({ message: 'Recorded time is required for audio notes' });
    }

    const newNote = new Note({
      title,
      content,
      type,
      recordedTime: type === 'audio' ? recordedTime : 0,
      userId,
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
    console.log("User ID from token:", req.user);

    const userId = req.user._id;
    const notes = await Note.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Fetch a note by ID
const getNoteById = async (req, res) => {
  try {
    console.log("User ID from token:", req.user);

    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found or does not belong to user' });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    console.log("User ID from token:", req.user);

    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found or does not belong to user' });
    }

    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    console.log("User ID from token:", req.user);

    const { id } = req.params;
    const updateFields = req.body;
    const userId = req.user._id;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId },
      updateFields,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found or does not belong to user' });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Upload an image for a note
// Upload an image for a note
const uploadImage = async (req, res) => {
  try {
    console.log("User ID from token:", req.user);
    console.log("Uploaded file:", req.file);  // Log the uploaded file

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { id } = req.params;
    const imageUrl = `/uploads/${req.file.filename}`;
    const userId = req.user._id;

    // Find the note to make sure it exists before updating
    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      console.log('Note not found');
      return res.status(404).json({ message: 'Note not found or does not belong to user' });
    }

    console.log('Note found:', note);

    // Update the note with the new image URL
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId },
      { imageUrl },
      { new: true }
    );

    console.log('Updated note with new image URL:', updatedNote);  // Log updated note with imageUrl

    if (!updatedNote) {
      return res.status(404).json({ message: 'Failed to update note' });
    }

    console.log('Image URL response:', updatedNote.imageUrl);  // Log the image URL response

    res.json(updatedNote);  // Send the updated note with imageUrl
  } catch (error) {
    console.error(error);  // Log the error
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};




// Toggle the favorite status of a note
const toggleFavorite = async (req, res) => {
  try {
    console.log("User ID from token:", req.user);

    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found or does not belong to user' });
    }

    note.isFavorite = !note.isFavorite;
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  deleteNote,
  updateNote,
  uploadImage,
  toggleFavorite,
};
