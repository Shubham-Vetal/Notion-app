import React, { useState } from 'react';
import { Mic, MicOff, Save } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const AudioRecorder = () => {
  const [title, setTitle] = useState('');
  const { addNote } = useNotes();
  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    resetTranscript,
    error
  } = useSpeechRecognition();

  const saveNote = async () => {
    try {
      await addNote({
        title: title || 'Voice Note',
        content: transcript,
        type: 'audio',
        time: new Date().toISOString(),
      });
      setTitle('');
      resetTranscript();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="flex gap-3 mb-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
            isRecording
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff size={20} /> Stop Recording
            </>
          ) : (
            <>
              <Mic size={20} /> Start Recording
            </>
          )}
        </button>
        <button
          onClick={saveNote}
          disabled={!transcript}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} /> Save Note
        </button>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mt-4">
        <p className="text-gray-600">{transcript || 'Recording in progress...'} </p>
      </div>
    </div>
  );
};

export default AudioRecorder;
