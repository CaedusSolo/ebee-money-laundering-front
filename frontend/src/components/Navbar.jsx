import React from 'react';
import navbarLogo from "../assets/navbarLogo.svg"
import { useAuth } from "../context/AuthContext"
import {Link, useNavigate} from 'react-router-dom'

export default function Navbar({ showBrowse = false }) {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // Check if user is a student (role must be exactly 'STUDENT')
  const isStudent = currentUser?.role === 'STUDENT';

  const handleProfileClick = () => {
    if (isStudent) {
      navigate('/student-dashboard');
    }
  };

  return (
      <nav className="fixed top-0 z-50 w-full bg-gradient-to-r from-blue-800 to-cyan-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-blue-700">
                <img src={navbarLogo} alt="Logo" />
            </div>
            <h1 className="text-2xl font-bold text-white"><Link to="/">Further Your Journey</Link></h1>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Blue Browse Scholarship Button */}
            {showBrowse && (
              <button
                onClick={() => navigate('/scholarships-list')}
                className="bg-blue-800 cursor-pointer hover:bg-blue-700 text-white font-semibold text-sm hover:text-gray-200 transition duration-200 border border-white/30 px-4 py-2 rounded-lg"
              >
                Browse Scholarships
              </button>
            )}

            <button
                onClick={logout}
                className="bg-red-500 cursor-pointer hover:bg-red-700 text-white font-semibold text-sm hover:text-gray-200 transition duration-200 border border-white/30 px-4 py-2 rounded-lg"
            >
                Logout
            </button>

            {/* Profile Icon - Clickable for students only */}
            <div 
                onClick={handleProfileClick}
                className={`w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-600 shadow-sm ${
                  isStudent ? 'cursor-pointer hover:bg-gray-100 transition duration-200' : ''
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>

          </div>
        </div>
      </nav>
  )
}
