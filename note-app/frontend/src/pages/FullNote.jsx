import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const FullNote = () => {
  const [note, setNote] = useState(null);
  const { id } = useParams(); // Get the note ID from the URL

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/notes/${id}`);
        const data = await response.json();
        setNote(data);
      } catch (error) {
        console.error('Error fetching note:', error);
      }
    };

    fetchNote();
  }, [id]);

  return (
    <div className="p-4">
      {note ? (
        <div className="border p-4 rounded-lg">
          <h3 className="text-2xl font-semibold">{note.title}</h3>
          <p>{note.content}</p> {/* Full content of the note */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FullNote;
