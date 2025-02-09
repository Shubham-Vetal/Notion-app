import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Context to manage notes
const NotesContext = createContext();

// Custom hook to use the Notes context
export const useNotes = () => useContext(NotesContext);

// Provider component for NotesContext
export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  // Fetch notes initially from the API
  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/notes'); // Your API endpoint
      setNotes(response.data); // Update notes state with fetched data
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Refetch notes (to be used when a new note is added, deleted, or favorited)
  const triggerRefetch = async () => {
    await fetchNotes(); // Re-fetch notes after any changes
  };

  // Add a new note
  const addNote = async (noteData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/notes', noteData); // Send POST request to add note
      setNotes((prevNotes) => [response.data, ...prevNotes]); // Optimistically update state with new note
      triggerRefetch(); // Re-fetch notes to make sure data is up-to-date
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/notes/${id}`); // Send DELETE request
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id)); // Optimistically update state
      triggerRefetch(); // Re-fetch notes after deleting
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Update note favorite status
  const updateNoteFavorite = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/api/notes/${id}/toggle-favorite`); // Send PATCH request to toggle favorite
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === id ? { ...note, isFavorite: !note.isFavorite } : note
        )
      ); // Optimistically update state
      triggerRefetch(); // Re-fetch notes after updating favorite
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Fetch notes when component mounts
  useEffect(() => {
    fetchNotes(); // Fetch notes initially when the provider is mounted
  }, []);

  return (
    <NotesContext.Provider value={{
      notes,
      addNote,
      deleteNote,
      updateNoteFavorite,
    }}>
      {children}
    </NotesContext.Provider>
  );
};
