import React, { useState } from 'react';
import { toast } from 'react-toastify';

const GameForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    date: '',
    opponent_team: '',
    location: 'Home', // Default value
    goals_for: '',
    goals_against: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/games/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add game: ${response.statusText}`);
      }

      const data = await response.json();
      onSubmit(data.gameId);
      // onContinue(data.gameId); // Pass game ID to the next step
      toast.success('Game added successfully');
    } catch (error) {
      console.error('Error adding game:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
      >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
        >
        <h2 className="text-2xl font-bold text-center mb-4">Add new Game</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full shadow-lg border-2 border-gray-300 p-2 rounded"
              required
            />
          </label>
          <label className="block mb-2">
            Opponent Team:
            <input
              type="text"
              name="opponent_team"
              value={formData.opponent_team}
              onChange={handleChange}
              className="w-full shadow-lg border-2 border-gray-300 p-2 rounded"
              required
            />
          </label>
          <label className="block mb-2">
            Location:
            <div className="flex space-x-4 mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="location"
                  value="Home"
                  checked={formData.location === 'Home'}
                  onChange={handleChange}
                  className="form-radio text-green-600"
                  required
                />
                <span className="ml-2">Home 🏠</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="location"
                  value="Away"
                  checked={formData.location === 'Away'}
                  onChange={handleChange}
                  className="form-radio text-blue-600"
                  required
                />
                <span className="ml-2">Away ✈️</span>
              </label>
            </div>
          </label>

          <label className="block mb-2">
            Goals For:
            <input
              type="number"
              name="goals_for"
              value={formData.goals_for}
              onChange={handleChange}
              className="w-full shadow-lg border-2 border-gray-300 p-2 rounded"
              required
            />
          </label>
          <label className="block mb-4">
            Goals Against:
            <input
              type="number"
              name="goals_against"
              value={formData.goals_against}
              onChange={handleChange}
              className="w-full shadow-lg border-2 border-gray-300 p-2 rounded"
              required
            />
          </label>
          <button
            type="submit"
            className="bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600"
          >
            Submit game and Add Player Stats
          </button>
          <button
            type="button"
            onClick={() => onClose()}
            className="ml-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameForm;
