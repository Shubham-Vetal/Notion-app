import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaMicrophone, FaPen } from 'react-icons/fa';

const NoteInput = ({ onAddNote, setRecordedTime }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedContent, setRecordedContent] = useState('');
  const [recordDuration, setRecordDuration] = useState(0); // State to store recording duration
  const [loading, setLoading] = useState(false); // State for loading indicator

  const recognitionRef = useRef(null);
  const recordTimerRef = useRef(null); // Ref to store the timer
  const recordStartTimeRef = useRef(null); // Ref to store start time

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
      setRecordDuration(finalDuration);  // Finalize duration when recording ends
      setRecordedTime(finalDuration); // Pass recorded time to the parent
      clearInterval(recordTimerRef.current); // Ensure timer is cleared when recording ends
      console.log(`Recording ended. Final duration: ${finalDuration}s`);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
      }
      clearInterval(recordTimerRef.current); // Cleanup timer on unmount
    };
  }, [setRecordedTime]);

  const handleStartRecording = () => {
    if (!recognitionRef.current) return;
    setIsRecording(true);
    setRecordDuration(0); // Reset duration at the start
    setRecordedContent('');
    recordStartTimeRef.current = Date.now(); // Record start time
    recognitionRef.current.start(); // Start speech recognition

    // Start the timer
    recordTimerRef.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - recordStartTimeRef.current) / 1000);
      setRecordDuration(elapsedTime); // Update duration based on elapsed time
      console.log(`Recording... ${elapsedTime}s`);
    }, 1000);
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // Stop the speech recognition
    }
    setIsRecording(false); // Update state to stop recording
    clearInterval(recordTimerRef.current); // Clear the interval once the recording stops
    const finalDuration = Math.floor((Date.now() - recordStartTimeRef.current) / 1000); 
    setRecordDuration(finalDuration);  // Update the final duration
    setRecordedTime(finalDuration); // Pass the final recorded time to parent
    console.log(`Recording manually stopped. Final duration: ${finalDuration}s`);
  };

  const handleAddNote = async () => {
    if (title.trim() === '' || content.trim() === '') {
      console.log('Title or Content is empty!');
      return;
    }

    setLoading(true); // Start loading when sending note

    // Prepare note data
    const noteData = {
      title,
      content,
      type: recordedContent ? 'audio' : 'text',
      recordedTime: recordedContent ? recordDuration : null, // Send recordedTime instead of duration
    };

    // Log the payload to check before sending
    console.log('Payload:', noteData);

    try {
      // Send POST request to backend API
      const response = await axios.post('http://localhost:4000/api/notes/create', noteData);
      console.log('Note created:', response.data);

      // Pass the newly created note to the parent
      onAddNote(response.data.note); // Ensure `response.data.note` contains the newly created note
      // Reset form after note creation
      setTitle('');
      setContent('');
      setRecordedContent('');
      setRecordDuration(0);
    } catch (error) {
      console.error('Error creating note:', error.response ? error.response.data : error);
    } finally {
      setLoading(false); // Stop loading after the request is complete
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative">
      <div className="absolute top-2 right-2">
        {recordedContent || isRecording ? (
          <FaMicrophone color="red" />
        ) : (
          <FaPen color="gray" />
        )}
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
