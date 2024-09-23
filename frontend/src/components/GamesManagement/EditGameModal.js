import React, { useState } from 'react';

const EditGameModal = ({ isOpen, onClose, onSave, game }) => {
  const [editedGame, setEditedGame] = useState({
    goals_for: game.goals_for,
    goals_against: game.goals_against,
    location: game.location,
    opponent_team: game.opponent_team,
    date: new Date(game.date).toISOString().substring(0, 10),
  });

  const handleChange = (e) => {
    setEditedGame({
      ...editedGame,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    onSave(editedGame);
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Game</h2>
        <div className="mb-2">
          <label>Opponent Team:</label>
          <input
            type="text"
            name="opponent_team"
            value={editedGame.opponent_team}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-2">
          <label>Goals For:</label>
          <input
            type="number"
            name="goals_for"
            value={editedGame.goals_for}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-2">
          <label>Goals Against:</label>
          <input
            type="number"
            name="goals_against"
            value={editedGame.goals_against}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-2">
          <label>Location:</label>
          <select
            name="location"
            value={editedGame.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Home">Home</option>
            <option value="Away">Away</option>
          </select>
        </div>
        <div className="mb-2">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={editedGame.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="mr-2 p-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSave} className="p-2 bg-blue-500 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditGameModal;
