import React from 'react';
import { GraduationCap, User, LogOut, Settings } from 'lucide-react';

const Navbar = ({ title, userRole, userName, onLogout }) => {
  const [showProfile, setShowProfile] = React.useState(false);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">{title}</span>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-gray-700 capitalize">{userName || userRole}</span>
            </button>

            {/* Dropdown Menu */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </a>
                  <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
