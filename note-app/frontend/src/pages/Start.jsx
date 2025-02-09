import React from 'react';
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <img 
          className="w-28 sm:w-36" 
          src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" 
          alt="Notion Logo"
        />
      </div>

      {/* Main Content */}
      <div className="text-center z-10">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Your Ideas, Organized.
        </h1>
        <p className="text-gray-600 mt-4 text-lg sm:text-xl max-w-lg mx-auto">
          A powerful workspace to take notes, manage tasks, and organize your work.
        </p>

        {/* CTA Button */}
        <Link 
          to="/login" 
          className="mt-8 inline-block bg-black text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-900 transition-all shadow-md sm:px-8 sm:py-4"
        >
          Get Started
        </Link>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20" 
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1920&auto=format&fit=crop)" }}>
      </div>
    </div>
  );
};

export default Start;
