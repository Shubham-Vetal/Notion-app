import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create a Notes context
export const NotesContext = createContext();

// Custom hook to access the Notes context
export const useNotes = () => useContext(NotesContext);

// Helper function to get the token from localStorage
const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : null;
};

// NotesProvider component to handle all notes-related logic
export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found, redirecting to login...");
        return;
      }

      const response = await axios.get("http://localhost:4000/api/notes", {
        headers: { Authorization: token },
      });

      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };
  

  // Create a new note
  const createNote = async (noteData) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.post("http://localhost:4000/api/notes/create", noteData, {
        headers: { Authorization: token, "Content-Type": "application/json" },
      });

      setNotes((prevNotes) => [response.data.note, ...prevNotes]);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      const token = getToken();
      if (!token) return;

      await axios.delete(`http://localhost:4000/api/notes/${id}`, {
        headers: { Authorization: token },
      });

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Update a note
  const updateNote = async (id, updatedNoteData) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.put(`http://localhost:4000/api/notes/${id}`, updatedNoteData, {
        headers: { Authorization: token, "Content-Type": "application/json" },
      });

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? response.data : note))
      );
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (id) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.patch(
        `http://localhost:4000/api/notes/${id}/toggle-favorite`,
        {},
        { headers: { Authorization: token } }
      );

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? response.data : note))
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Search notes
  const searchNotes = (searchTerm) => {
    if (!searchTerm.trim()) {
      fetchNotes();
      return;
    }

    setNotes((prevNotes) =>
      prevNotes.filter(
        (note) =>
          note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // **Sorting Notes Properly**
  const sortNotes = (type, order = "asc") => {
    setNotes((prevNotes) => {
      let sortedNotes = [...prevNotes]; // Create a new copy of the notes to avoid mutation
  
      console.log(`Sorting by: ${type}`); // Log sorting type for debugging
  
      if (type === "name") {
        console.log("Sorting by name...");
        sortedNotes.sort((a, b) => {
          const titleA = a.title?.toLowerCase() || "";
          const titleB = b.title?.toLowerCase() || "";
          return order === "asc"
            ? titleA.localeCompare(titleB)
            : titleB.localeCompare(titleA);
        });
      } else if (type === "date") {
        console.log("Sorting by date...");
        sortedNotes.sort((a, b) => {
          const dateA = new Date(a.timestamp || 0); // Parse timestamp into Date
          const dateB = new Date(b.timestamp || 0);
          return order === "asc" ? dateA - dateB : dateB - dateA;
        });
      }
  
      console.log("Sorted notes:", sortedNotes); // Log sorted notes for debugging
  
      return sortedNotes; // Return sorted array to trigger re-render
    });
  };
  
  
  

  return (
    <NotesContext.Provider
      value={{
        notes,
        fetchNotes,
        createNote,
        deleteNote,
        updateNote,
        toggleFavorite,
        searchNotes,
        setNotes,
        sortNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
