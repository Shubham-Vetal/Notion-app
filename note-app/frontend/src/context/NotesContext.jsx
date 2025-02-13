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
  const [originalNotes, setOriginalNotes] = useState([]); // State to store the original notes
  const [loadingImage, setLoadingImage] = useState(false); // Track loading status for image upload
  const [errorImage, setErrorImage] = useState(null); // Track errors for image upload


// clear notes function to clear all notes after user logout
  const clearNotes = () => {
    setNotes([]);
    setOriginalNotes([]);
  };

  useEffect(() => {
    // Fetch notes whenever the component mounts
    fetchNotes();
  }, []);  // Empty dependency array ensures it runs on mount

  const fetchNotes = async () => {
    try {
      const token = getToken();
      console.log("Sending token:", token);  // Log token before sending the request
      if (!token) {
        console.error("No token found, redirecting to login...");
        return;
      }

      const response = await axios.get("http://localhost:4000/api/notes", {
        headers: { Authorization: token },
      });

      console.log("Fetched notes:", response.data);
      setNotes(response.data);
      setOriginalNotes(response.data);  // Save the fetched notes as the original state
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Create a new note
  const createNote = async (noteData) => {
    try {
      const token = getToken();
      if (!token) return;

      console.log("Creating note with data:", noteData);
      const response = await axios.post("http://localhost:4000/api/notes", noteData, {
        headers: { Authorization: token, "Content-Type": "application/json" },
      });

      console.log("Created note response:", response.data);
      fetchNotes(); // Re-fetch notes to include the new note
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      const token = getToken();
      if (!token) return;

      console.log("Deleting note with id:", id);
      await axios.delete(`http://localhost:4000/api/notes/${id}`, {
        headers: { Authorization: token },
      });

      console.log("Deleted note with id:", id);
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

      console.log("Updating note with id:", id, "and data:", updatedNoteData);
      const response = await axios.put(`http://localhost:4000/api/notes/${id}`, updatedNoteData, {
        headers: { Authorization: token, "Content-Type": "application/json" },
      });

      console.log("Updated note response:", response.data);
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

      console.log("Toggling favorite for note with id:", id);
      const response = await axios.patch(
        `http://localhost:4000/api/notes/${id}/toggle-favorite`,
        {},
        { headers: { Authorization: token } }
      );

      console.log("Toggled favorite response:", response.data);
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
      // Reset to original notes if search is cleared
      setNotes(originalNotes);
      return;
    }

    const filteredNotes = originalNotes.filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setNotes(filteredNotes);
  };

  // Sorting Notes
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

  // Image Upload Logic with Debugging Logs
  const uploadImage = async (noteId, selectedImageFile) => {
    try {
      console.log("Starting image upload for note ID:", noteId);

      const token = getToken();
      if (!token) {
        console.error("No token found for image upload.");
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedImageFile); // Ensure selectedImageFile is the image file object

      console.log("Uploading image with formData:", formData);

      setLoadingImage(true);
      setErrorImage(null);

      // Make the request to upload the image
      const response = await axios.patch(
        `http://localhost:4000/api/notes/upload-image/${noteId}`,
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("Image uploaded successfully:", response.data);

      // Log the constructed image URL
      const imageUrl = `http://localhost:4000${response.data.imageUrl}`;
      console.log("Constructed image URL:", imageUrl);

      // Update the notes state with the uploaded image URL
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? { ...note, imageUrl: response.data.imageUrl } : note
        )
      );

      setLoadingImage(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorImage("Failed to upload image. Please try again.");
      setLoadingImage(false);
    }
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
        uploadImage,
        loadingImage,
        errorImage,
        clearNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
