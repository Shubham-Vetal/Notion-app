import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNotes } from "../context/NotesContext";
import { FaExpand, FaCompress, FaTrash, FaClipboard, FaStar, FaSort, FaMicrophone, FaPen } from "react-icons/fa";
import Sidebar from "../components/SidebarComponent";
import SearchBar from "../components/SearchbarComponent";
import NoteInput from "../components/NoteInput";
import NoteModal from "../components/NoteModal";
import ErrorBoundary from "../components/ErrorBoundary";

const Home = () => {
  console.log("Home component rendered");
  const { notes, fetchNotes, deleteNote, updateNote, toggleFavorite, searchNotes } = useNotes();
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortType, setSortType] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [recordedTime, setRecordedTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const intervalRef = useRef(null);

  // State to track if notes have been fetched and if no notes are available
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch notes on mount only if notes are empty
  useEffect(() => {
    console.log("Fetching notes...");
    if (notes.length === 0 && !hasFetched) {
      fetchNotes();
      setHasFetched(true);  // Prevent re-fetching or rendering empty message again
    }
  }, [fetchNotes, notes.length, hasFetched]);

  useEffect(() => {
    console.log("Notes fetched:", notes);
  }, [notes]);

  // Filter notes based on favorites
  const filteredNotes = useMemo(() => {
    console.log("Filtering notes with favorites:", showFavorites);
    return showFavorites ? notes.filter((note) => note.isFavorite) : notes;
  }, [notes, showFavorites]);

  // **Sorting Notes**
  const sortedNotes = useMemo(() => {
    let sortedArray = [...filteredNotes]; // Create a copy to avoid mutation

    console.log("Sorting notes by:", sortType, "Order:", sortOrder);
    if (sortType === "name") {
      sortedArray.sort((a, b) => {
        const titleA = a.title?.toLowerCase() || "";
        const titleB = b.title?.toLowerCase() || "";
        return sortOrder === "asc" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
      });
    } else if (sortType === "date") {
      sortedArray.sort((a, b) => {
        const dateA = new Date(a.timestamp || 0);
        const dateB = new Date(b.timestamp || 0);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    console.log("Sorted notes:", sortedArray);
    return sortedArray;
  }, [filteredNotes, sortType, sortOrder]);

  const handleSort = (type) => {
    if (sortType === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortType(type);
      setSortOrder("asc");  // Reset to ascending when switching sort criteria
    }
    setShowSortOptions(false);  // Close the sort options after selection
  };

  const handleToggleFavorites = () => {
    console.log("Toggling favorites");
    setShowFavorites(!showFavorites);
  };

  const handleSearch = (searchTerm) => {
    console.log("Searching notes with term:", searchTerm);
    searchNotes(searchTerm);
  };

  const handleNoteClick = (note) => {
    console.log("Note clicked:", note);
    setSelectedNote(note);
    setModalOpen(true);
  };

  const handleCopy = (text) => {
    console.log("Copying text to clipboard:", text);
    navigator.clipboard.writeText(text);
    alert("Note copied to clipboard!");
  };

  const startRecording = () => {
    console.log("Starting recording...");
    setIsRecording(true);
    let time = 0;
    intervalRef.current = setInterval(() => {
      setRecordedTime(++time);
    }, 1000);
  };

  const stopRecording = () => {
    console.log("Stopping recording...");
    setIsRecording(false);
    clearInterval(intervalRef.current);
  };

  const handleUpdateNote = (id, updatedNoteData) => {
    console.log("Updating note:", id, updatedNoteData);
    updateNote(id, updatedNoteData);
  };

  const handleAddNote = (newNote) => {
    console.log("Adding note:", newNote);
    if (newNote.type === "audio") {
      newNote.recordedTime = recordedTime;
    }
  };

  const toggleFullscreen = () => {
    const modalElement = document.querySelector(".note-modal");
    if (modalElement) {
      if (!document.fullscreenElement) {
        modalElement.requestFullscreen()
          .then(() => setFullscreen(true))
          .catch(console.error);
      } else {
        document.exitFullscreen()
          .then(() => setFullscreen(false))
          .catch(console.error);
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar showFavorites={handleToggleFavorites} resetFavorites={() => setShowFavorites(false)} />
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
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                <button className="block w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleSort("name")}>
                  Sort by Name
                </button>
                <button className="block w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleSort("date")}>
                  Sort by Date & Time
                </button>
              </div>
            )}
          </div>
        </div>

        <NoteInput onAddNote={handleAddNote} setRecordedTime={setRecordedTime} />

        {/* Notes Grid with Sorting Display */}
        <div className="grid grid-cols-2 gap-4 mt-4 max-h-[calc(100vh-150px)] overflow-y-auto">
          {sortedNotes.length === 0 && hasFetched ? (
            <p>No notes available</p>
          ) : (
            sortedNotes.map((note, index) => (
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
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(note._id || note.id); }}
                    className={`text-xl ${note.isFavorite ? "text-yellow-500" : "text-gray-400"}`}
                  >
                    <FaStar />
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNote(note._id || note.id); }}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopy(note.content); }}
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
            ))
          )}
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
            recordedTime={recordedTime}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Home;
