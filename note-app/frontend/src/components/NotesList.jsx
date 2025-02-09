import React from 'react';
import { Star, Trash2 } from 'lucide-react';

const NotesList = ({ notes, onDelete, onToggleFavorite }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <div key={note._id} className="p-4 bg-white rounded-lg shadow-md relative">
          <button 
            onClick={() => onToggleFavorite(note._id)} // Use _id here
            className="absolute top-2 right-2"
            aria-label={`Toggle favorite for ${note.title}`}
          >
            <Star size={20} className={note.isFavorite ? 'text-yellow-500' : 'text-gray-400'} />
          </button>
          <h2 className="text-lg font-semibold">{note.title}</h2>
          <p className="text-gray-600">{note.content}</p>
          <span className="text-xs text-gray-400">
            {new Date(note.timestamp).toLocaleString()} {/* Corrected timestamp */}
          </span>
          <button 
            onClick={() => onDelete(note._id)} // Use _id here
            className="absolute bottom-2 right-2"
            aria-label={`Delete note ${note.title}`}
          >
            <Trash2 size={20} className="text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
