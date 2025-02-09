import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Star, LogOut } from 'react-feather';

const Sidebar = ({ showFavorites, resetFavorites }) => {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">AI Notes</h2>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {/* Home Button */}
          <li>
            <Link
              to="/home"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600"
              onClick={() => {
                resetFavorites(); // Reset favorites when Home is clicked
                console.log("Home clicked"); // Debugging log
              }}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
          </li>

          {/* Favourites Button */}
          <li>
            <button
              onClick={showFavorites} // Toggle the favorites view
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600 w-full text-left"
            >
              <Star size={20} />
              <span>Favourites</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <ul className="space-y-2">
          {/* Logout Button */}
          <li>
            <Link
              to="/user/logout"
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
