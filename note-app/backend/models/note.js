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
    default: false,  // Favorite status field
  },
  imageUrl: {
    type: String,  // Field to store image path
    default: null,
  },
  recordedTime: {  // Add recordedTime field to store the duration of the audio recording
    type: Number,
    default: 0,
  }
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
