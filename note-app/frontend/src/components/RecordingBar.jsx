import React from "react";
import { FaPen, FaImage } from "react-icons/fa";

const RecordingBar = () => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white flex items-center shadow-lg px-6 py-3 rounded-full space-x-4">
      <FaPen className="text-gray-500 text-lg cursor-pointer" />
      <FaImage className="text-gray-500 text-lg cursor-pointer" />
      <button className="bg-red-500 text-white px-4 py-2 rounded-full">
        Start Recording
      </button>
    </div>
  );
};

export default RecordingBar;
