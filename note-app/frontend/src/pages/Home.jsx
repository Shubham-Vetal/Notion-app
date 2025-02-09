import React, { useState, useEffect } from "react";
import { FaExpand, FaCompress, FaTrash, FaClipboard, FaStar, FaSort, FaMicrophone, FaPen } from "react-icons/fa";
import Sidebar from "../components/SidebarComponent";
import SearchBar from "../components/SearchbarComponent";
import NoteInput from "../components/NoteInput";
import NoteModal from "../components/NoteModal";
import ErrorBoundary from "../components/ErrorBoundary";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortType, setSortType] = useState(null);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const [recordedTime, setRecordedTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/notes/${id}/toggle-favorite`,
        { method: "PATCH" }
      );
      if (!response.ok) throw new Error("Failed to toggle favorite");
      const updatedNote = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? updatedNote : note))
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/notes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete note");
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleToggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === "") {
      fetchNotes();
    } else {
      const filteredNotes = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setNotes(filteredNotes);
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setModalOpen(true);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Note content copied to clipboard!");
  };

  const handleSort = (type) => {
    let sortedNotes = [...notes];
    if (type === "name") {
      sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
    } else if (type === "date") {
      sortedNotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    setNotes(sortedNotes);
    setSortType(type);
    setShowSortOptions(false);
  };

  const startRecording = () => {
    setIsRecording(true);
    let time = 0;
    const interval = setInterval(() => {
      if (isRecording) {
        setRecordedTime(time++);
      }
    }, 1000);

    setIntervalId(interval);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(intervalId);
  };

  const handleUpdateNote = async (id, updatedNoteData) => {
    try {
      const response = await fetch(`http://localhost:4000/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNoteData),
      });
      if (!response.ok) throw new Error("Failed to update note");
      const updatedNote = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? updatedNote : note))
      );
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleAddNote = (newNote) => {
    if (newNote.type === "audio") {
      newNote.recordedTime = recordedTime;
    }
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  const displayedNotes = showFavorites
    ? notes.filter((note) => note.isFavorite)
    : notes;

  const toggleFullscreen = () => {
    const modalElement = document.querySelector(".note-modal");

    if (!document.fullscreenElement) {
      modalElement.requestFullscreen()
        .then(() => setFullscreen(true))
        .catch(console.error);
    } else {
      document.exitFullscreen()
        .then(() => setFullscreen(false))
        .catch(console.error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        showFavorites={handleToggleFavorites}
        resetFavorites={() => setShowFavorites(false)}
      />
      <div id="app-container" className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-between items-center">
          <SearchBar onSearch={handleSearch} />
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              Sort <FaSort />
            </button>
            {showSortOptions && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  Sort by Name
                </button>
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => handleSort("date")}
                >
                  Sort by Date & Time
                </button>
              </div>
            )}
          </div>
        </div>

        <NoteInput onAddNote={handleAddNote} setRecordedTime={setRecordedTime} />

        <div className="grid grid-cols-2 gap-4 mt-4 max-h-[calc(100vh-150px)] overflow-y-auto">
          {displayedNotes.map((note, index) => (
            <div
              key={note._id || note.id || index}
              className="relative border p-4 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => handleNoteClick(note)}
            >
              <h3 className="text-xl font-semibold">{note.title}</h3>
              <p className="text-gray-700">{note.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                🕒 {new Date(note.timestamp).toLocaleString()}
              </p>
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(note._id || note.id);
                  }}
                  className={`text-xl ${note.isFavorite ? "text-yellow-500" : "text-gray-400"}`}
                >
                  <FaStar />
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note._id || note.id);
                    }}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(note.content);
                    }}
                    className="text-gray-500"
                  >
                    <FaClipboard />
                  </button>
                </div>
              </div>

              {note.type === "audio" && (
                <div className="absolute top-2 right-2 flex items-center space-x-1 text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaMicrophone className="text-red-500" />
                    <span>{note.recordedTime}s</span>
                  </div>
                </div>
              )}

              {note.type === "text" && (
                <div className="absolute top-2 right-2">
                  <FaPen className="text-green-500" />
                </div>
              )}
            </div>
          ))}
        </div>

        <ErrorBoundary>
        <NoteModal
  note={selectedNote}
  isOpen={isModalOpen}
  onClose={() => setModalOpen(false)}
  onUpdate={handleUpdateNote}
  handleCopy={handleCopy}
  isFullscreen={isFullscreen}
  onFullscreenToggle={toggleFullscreen}
  className="note-modal"
  startRecording={startRecording}
  stopRecording={stopRecording}
  recordedTime={recordedTime} // Ensure this is being passed correctly
/>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Home;
