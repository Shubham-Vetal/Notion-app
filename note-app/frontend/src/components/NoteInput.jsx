import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaPen } from 'react-icons/fa';
import { useNotes } from "../context/NotesContext"; // Using Notes Context

const NoteInput = ({ setRecordedTime }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedContent, setRecordedContent] = useState('');
  const [recordDuration, setRecordDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  const { createNote } = useNotes(); // Get createNote from context
  const recognitionRef = useRef(null);
  const recordTimerRef = useRef(null);
  const recordStartTimeRef = useRef(null);

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setRecordedContent(transcript);
      setContent(transcript);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      const finalDuration = Math.floor((Date.now() - recordStartTimeRef.current) / 1000);
      setRecordDuration(finalDuration);
      setRecordedTime(finalDuration);
      clearInterval(recordTimerRef.current);
      console.log(`Recording ended. Final duration: ${finalDuration}s`);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
      }
      clearInterval(recordTimerRef.current);
    };
  }, [setRecordedTime]);

  const handleStartRecording = () => {
    if (!recognitionRef.current) return;
    setIsRecording(true);
    setRecordDuration(0);
    setRecordedContent('');
    recordStartTimeRef.current = Date.now();
    recognitionRef.current.start();

    recordTimerRef.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - recordStartTimeRef.current) / 1000);
      setRecordDuration(elapsedTime);
      console.log(`Recording... ${elapsedTime}s`);
    }, 1000);
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    clearInterval(recordTimerRef.current);
    const finalDuration = Math.floor((Date.now() - recordStartTimeRef.current) / 1000);
    setRecordDuration(finalDuration);
    setRecordedTime(finalDuration);
    console.log(`Recording manually stopped. Final duration: ${finalDuration}s`);
  };

  const handleAddNote = async () => {
    if (title.trim() === '' || content.trim() === '') {
      console.log('Title or Content is empty!');
      return;
    }

    setLoading(true);

    const noteData = {
      title,
      content,
      type: recordedContent ? 'audio' : 'text',
      recordedTime: recordedContent ? recordDuration : null,
    };

    try {
      await createNote(noteData); // Use context function instead of axios
      setTitle('');
      setContent('');
      setRecordedContent('');
      setRecordDuration(0);
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative">
      <div className="absolute top-2 right-2">
        {recordedContent || isRecording ? <FaMicrophone color="red" /> : <FaPen color="gray" />}
      </div>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border-b mb-2 p-2 outline-none"
      />

      <textarea
        placeholder="Write or record your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 outline-none h-20"
      ></textarea>

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleStartRecording}
          disabled={isRecording || loading}
          className={`px-4 py-2 rounded-lg ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
        >
          {isRecording ? `Recording... ${recordDuration}s` : 'Record'}
        </button>

        {isRecording && (
          <button
            onClick={handleStopRecording}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg"
          >
            Stop
          </button>
        )}

        <button
          onClick={handleAddNote}
          className={`px-4 py-2 ${loading ? 'bg-gray-500' : 'bg-green-500'} text-white rounded-lg`}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Note'}
        </button>
      </div>

      {recordedContent && !isRecording && (
        <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
          <FaMicrophone color="red" />
          Recording: {recordDuration} sec
        </div>
      )}
    </div>
  );
};

export default NoteInput;
