import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const ChangeTeamNameModal = ({ isOpen, onClose }) => {
  const [newTeamName, setNewTeamName] = useState('');

  const handleChangeTeamName = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/change-team-name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Ensures cookies (like the JWT) are sent with the request
        body: JSON.stringify({ teamName: newTeamName }),
      });

      if (!response.ok) {
        throw new Error('Failed to change team name');
      }

      localStorage.setItem('teamName', newTeamName);

      toast.success('Team name updated successfully!', { position: 'top-right', autoClose: 2000 });
      onClose();
    } catch (error) {
      toast.error('Error changing team name. Please try again.', { position: 'top-right', autoClose: 2000 });
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 z-50"
        onClick={onClose}
        >
        <div className="bg-white p-6 rounded-lg shadow-xl w-[320px] h-[320px] relative"
          onClick={(e) => e.stopPropagation()}
          >
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl">
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">Change Team Name</h2>
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="border border-gray-500 px-2 py-1 mt-5 rounded w-full"
            placeholder="Enter new team name"
          />
          <button
            onClick={handleChangeTeamName}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full mt-10"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full mt-4"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  );
}

ChangeTeamNameModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChangeTeamNameModal;
