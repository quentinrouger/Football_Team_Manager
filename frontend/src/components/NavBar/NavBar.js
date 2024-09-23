import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SettingsMenu from './SettingsMenu';

const NavBar = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const teamName = localStorage.getItem('teamName');

  const handleLogout = async () => {
    const username = localStorage.getItem('username');
  
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      if (!response.ok) throw new Error('Failed to logout');
  
      localStorage.removeItem('username');
      localStorage.removeItem('teamName');
  
      toast.success(`See you soon, ${username || 'Manager'}!`, {
        position: 'top-right',
        autoClose: 2000,
      });
  
      setTimeout(() => {
        navigate('/');
      }, 1500);
  
    } catch (error) {
      toast.error('Logout failed. Please try again.', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Home Link (left) */}
        <div className="text-white text-2xl font-bold">
          <h1> {teamName} </h1>
        </div>

        {/* Navigation Links (center) */}
        <div className="flex-grow text-2xl flex justify-center ml-28">
          <NavLink
            to="/players"
            className={({ isActive }) => isActive ? 'underline text-white mx-4' : 'text-white mx-4 hover:underline'}
          >
            My team
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) => isActive ? 'underline text-white mx-4' : 'text-white mx-4 hover:underline'}
          >
            Team stats
          </NavLink>
          <NavLink
            to="/medical-center"
            className={({ isActive }) => isActive ? 'underline text-white mx-4' : 'text-white mx-4 hover:underline'}
          >
            Medical Center
          </NavLink>
          <NavLink
            to="/games"
            className={({ isActive }) => isActive ? 'underline text-white mx-4' : 'text-white mx-4 hover:underline'}
          >
            Results
          </NavLink>
        </div>

        {/* Settings and Logout Buttons (right) */}
        <div className="flex items-center">
          <button
            onClick={() => setSettingsOpen(true)}
            className="bg-neutral-200 hover:bg-neutral-300 text-white font-bold py-2 px-4 mx-4 rounded"
          >
            <img
              src="/images/settings.png"
              alt="Settings"
              className="w-6 h-6"
            />
          </button>
          
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
          >
            Logout
            <img
              src="/images/logout-icon.png"
              alt="Logout"
              className="w-4 h-4 ml-2"
            />
          </button>
        </div>
      </div>

      {/* ToastContainer to render the toast notifications */}
      <ToastContainer />
      
      {/* Settings Menu Modal */}
      <SettingsMenu isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
    </nav>
  );
};

export default NavBar;
