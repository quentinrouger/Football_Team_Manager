import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="relative flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/Homepage2.png')" }}
    >
      {/* Overlay for darkening the background image */}
      <div className="absolute inset-0 bg-black opacity-10"></div>

      {/* Main content */}
      <div className="relative z-10 text-center text-white p-6">
        <h1 className="text-6xl font-bold mb-4">Football Team Manager</h1>
        <p className="text-xl w-1/2 mx-auto mb-8">Football Team Manager is a web application designed for football coaches and managers. Manage basic player informations and injuries, track team results and player statistics across the season !</p>

        {/* Buttons for Register and Login */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/register')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform  transition-transform"
          >
            Register
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
