const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['audio', 'text'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  imageUrl: { // ✅ New: Allow image upload in notes
    type: String,
    default: null,
  },
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
