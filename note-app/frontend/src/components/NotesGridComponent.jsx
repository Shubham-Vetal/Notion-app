import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteCard from "./NoteCard";

const NotesGrid = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/notes/")
      .then((response) => setNotes(response.data))
      .catch((error) => console.error("Error fetching notes:", error));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:4000/api/notes/${id}`)
      .then(() => setNotes(notes.filter((note) => note._id !== id)))
      .catch((error) => console.error("Error deleting note:", error));
  };

  const handleToggleFavorite = (id, isFavorite) => {
    axios
      .put(`http://localhost:4000/api/notes/${id}`, { isFavorite })
      .then(() => {
        setNotes(
          notes.map((note) =>
            note._id === id ? { ...note, isFavorite } : note
          )
        );
      })
      .catch((error) =>
        console.error("Error updating favorite status:", error)
      );
  };

  const handleRenameNote = (id, newTitle) => {
    axios
      .put(`http://localhost:4000/api/notes/${id}`, { title: newTitle })
      .then((response) => {
        setNotes(
          notes.map((note) => (note._id === id ? response.data : note))
        );
      })
      .catch((error) => console.error("Error renaming note:", error));
  };

  return (
    <div className="w-full h-[600px] overflow-y-auto border border-gray-300 rounded-lg p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onDelete={handleDelete}
            onToggleFavorite={(id) => handleToggleFavorite(id, !note.isFavorite)}
            onUpdate={(id, updatedData) =>
              handleRenameNote(id, updatedData.title)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default NotesGrid;
