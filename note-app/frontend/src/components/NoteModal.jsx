import React, { useState, useEffect } from "react";
import { FaClipboard, FaExpand, FaCompress, FaTimes, FaMicrophone } from "react-icons/fa";

const NoteModal = ({
  note,
  isOpen,
  onClose,
  onUpdate,
  handleCopy,
  isFullscreen,
  onFullscreenToggle,
  className,
  startRecording,
  stopRecording,
  recordedTime,
}) => {
  const [noteData, setNoteData] = useState(
    note || { title: "", content: "", type: "text", transcription: "", image: "", isFavorite: false, timestamp: Date.now() }
  );
  const [image, setImage] = useState(note?.image || null);
  const [activeTab, setActiveTab] = useState("Notes");

  useEffect(() => {
    if (note) setNoteData(note);
  }, [note]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteData.title || !noteData.content) {
      alert("Title and content are required");
      return;
    }
    onUpdate(note._id, noteData);
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setNoteData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setNoteData((prev) => ({ ...prev, image: "" }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${className}`}>
      <div
        className={`bg-white p-6 rounded-lg shadow-lg transition-all duration-300
          ${isFullscreen ? 'w-full h-full p-10 overflow-auto' : 'w-[400px] max-h-[90vh] overflow-y-auto'}`}
      >
        {/* Navbar with Share and Fullscreen */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            {/* Fullscreen Toggle */}
            <button
              onClick={onFullscreenToggle}
              className="text-gray-500 hover:text-gray-700"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
            </button>
          </div>

          {/* Share Button moved to top-right corner */}
          <button
            onClick={() => alert('Share clicked!')}
            className="bg-gray-100 text-gray-500 hover:text-gray-700 px-3 py-1 rounded-full"
            title="Share"
          >
            Share
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            title="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Note Title and Date with Mic Icon */}
        <div className="mb-2 flex justify-between items-center">
          <div className="w-full">
            <h2 className="font-bold text-xl mb-1">
              <input
                type="text"
                name="title"
                value={noteData.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full border p-2 rounded outline-none"
              />
            </h2>
            <p className="text-sm text-gray-500">{new Date(noteData.timestamp).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center space-x-2">
            {noteData.type === "audio" && (
              <>
                <FaMicrophone size={18} className="ml-2 text-gray-500" title="Recording" />
                <span className="text-gray-500">{recordedTime}s</span> {/* Display audio time */}
              </>
            )}
          </div>
        </div>

        {/* Navbar for Notes, Transcript, and Create SpeakerTranscript */}
        <div className="flex space-x-4 mb-4">
          {["Notes", "Transcript", "Create SpeakerTranscript"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 rounded-full text-sm 
                ${activeTab === tab ? 'bg-white text-blue-500 shadow-lg' : 'bg-gray-100 text-gray-700'}`}
            >
              {tab === "Notes" && <span>📝 {tab}</span>}
              {tab === "Transcript" && <span>📜 {tab}</span>}
              {tab === "Create SpeakerTranscript" && <span>🎙 {tab}</span>}
            </button>
          ))}
        </div>

        {/* Content Input */}
        <div className="flex justify-between mb-4">
          <textarea
            name="content"
            value={noteData.content}
            onChange={handleChange}
            placeholder="Content"
            className="border p-2 w-full mr-4 rounded h-40 outline-none"
          />
          {/* Copy Button */}
          <button
            onClick={() => handleCopy(noteData.content)}
            className="text-gray-600 hover:text-black flex items-center mt-2"
            title="Copy to clipboard"
          >
            <FaClipboard size={20} className="mr-2" /> Copy
          </button>
        </div>

        {/* Transcription (if audio note) */}
        {noteData.type === "audio" && noteData.transcription && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Transcription:</h3>
            <p className="p-2 bg-gray-100 rounded">{noteData.transcription}</p>
          </div>
        )}

        {/* Image Display */}
        {image && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Uploaded Image:</h3>
            <img
              src={image}
              alt="Uploaded"
              className="max-w-full max-h-60 rounded mb-2"
            />
            <button
              onClick={handleImageRemove}
              className="text-red-500 hover:text-red-700 flex items-center"
            >
              <FaTimes className="mr-2" /> Remove Image
            </button>
          </div>
        )}

        {/* Image Upload */}
        {!image && (
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border p-2 w-full rounded"
            />
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NoteModal;
