import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const SelectPlayerModal = ({ players, onSelect, onClose }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const player = players.find((p) => p.id === parseInt(selectedPlayer, 10));
    if (player) onSelect(player, notes);

    toast.success('Player added to the medical center!');
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      >
      <div className="bg-white p-6 rounded shadow-lg"
        onClick={(e) => e.stopPropagation()}
        >
        <h2 className="text-2xl font-bold text-center mb-4">Select Player</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="player" className="block text-sm font-medium text-gray-700">
              Player
            </label>
            <select
              id="player"
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="shadow-lg border-2 border-gray-300 rounded-md px-3 py-2 w-full"
              required
            >
              <option value="">Select a player</option>
              {players
                .filter((player) => player.isInjured === 0)
                .map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="shadow-lg border-2 border-gray-300 rounded-md px-3 py-2 w-full"
              rows="4"
            />
          </div>
          <div className="flex justify-start space-x-2">
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SelectPlayerModal.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      isInjured: PropTypes.number.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SelectPlayerModal;
