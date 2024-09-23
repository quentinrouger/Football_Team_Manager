import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AddPlayerStatsForm from './AddPlayerStatsForm';
import DeletePlayerModal from './DeletePlayerModal';

const PlayerStatsModal = ({ isOpen, onClose, players, onSave, gameId }) => {
  const [editedPlayers, setEditedPlayers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null); // Track the selected player for deletion

  useEffect(() => {
    setEditedPlayers(players);
  }, [players]);

  const handleChange = (playerId, field, value) => {
    setEditedPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.player_id === playerId ? { ...player, [field]: value } : player
      )
    );
  };

  const handleSave = () => {
    onSave(editedPlayers);
    onClose();
    toast.success('Player stats saved successfully');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleAddNewPlayer = (newPlayers) => {
    if (Array.isArray(newPlayers)) {
      setEditedPlayers(prevPlayers => [...prevPlayers, ...newPlayers]);
      setIsAdding(false);
    } else {
      console.error('Expected newPlayers to be an array');
    }
  };

  const openDeleteModal = (player) => {
    setSelectedPlayer(player); // Set the selected player for deletion
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    fetch(`http://localhost:5000/api/games/${gameId}/player-stats/${selectedPlayer.player_id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          toast.success(data.message);
          setEditedPlayers((prevPlayers) =>
            prevPlayers.filter((player) => player.player_id !== selectedPlayer.player_id)
          );
        } else {
          toast.error('Failed to delete player stats');
        }
      })
      .catch(() => toast.error('Error occurred while deleting player stats'))
      .finally(() => {
        setIsDeleteModalOpen(false);
        setSelectedPlayer(null); // Clear the selected player
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-120" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-center mb-4">Player Stats</h2>

        {isAdding ? (
          <AddPlayerStatsForm gameId={gameId} onSubmit={handleAddNewPlayer} onClose={() => setIsAdding(false)} />
        ) : (
          <>
            {editedPlayers.length > 0 ? (
              <ul className="space-y-2">
                {editedPlayers.map((player) => (
                  <li key={player.player_id} className="p-2 border-b border-gray-300 flex items-center">
                    <div className="flex-1">
                      <p className="font-semibold flex items-center">{player.player_name}:</p>
                    </div>

                    <div className="flex-1 flex justify-end items-center space-x-2">
                      {/* Goals Input */}
                      <div className="flex items-center">
                        <span className="ml-2">⚽️</span>
                        <input
                          type="number"
                          value={player.goals}
                          onChange={(e) => handleChange(player.player_id, 'goals', e.target.value)}
                          className="ml-2 w-16 shadow-md border-2 border-gray-300 rounded p-1 text-center"
                        />
                      </div>

                      {/* Assists Input */}
                      <div className="flex items-center">
                        <span className="ml-2">🅰️</span>
                        <input
                          type="number"
                          value={player.assists}
                          onChange={(e) => handleChange(player.player_id, 'assists', e.target.value)}
                          className="ml-2 w-16 shadow-md border-2 border-gray-300 rounded p-1 text-center"
                        />
                      </div>

                      {/* Minutes Played Input */}
                      <div className="flex items-center">
                        <span className="ml-2">⏱</span>
                        <input
                          type="number"
                          value={player.minutes_played}
                          onChange={(e) => handleChange(player.player_id, 'minutes_played', e.target.value)}
                          className="ml-2 w-16 shadow-md border-2 border-gray-300 rounded p-1 text-center"
                        />
                      </div>

                      {/* Yellow Cards Input */}
                      <div className="flex items-center">
                        <span className="ml-2">🟨</span>
                        <input
                          type="number"
                          value={player.yellow_cards}
                          onChange={(e) => handleChange(player.player_id, 'yellow_cards', e.target.value)}
                          className="ml-2 w-16 shadow-md border-2 border-gray-300 rounded p-1 text-center"
                        />
                      </div>

                      {/* Red Cards Input */}
                      <div className="flex items-center">
                        <span className="ml-2">🟥</span>
                        <input
                          type="number"
                          value={player.red_cards}
                          onChange={(e) => handleChange(player.player_id, 'red_cards', e.target.value)}
                          className="ml-2 w-16 shadow-md border-2 border-gray-300 rounded p-1 text-center"
                        />
                      </div>

                      {/* Game Started Checkbox */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={player.gameStarted}
                          onChange={(e) => handleChange(player.player_id, 'gameStarted', e.target.checked)}
                          className="m-2 w-5 h-5"
                        />
                        <span>{player.gameStarted ? '🚶 Starter' : '🔄 Sub'}</span>
                      </div>

                      {/* Delete Player Button */}
                      <div className="relative group">
                        <button
                          className="bg-stone-200 hover:bg-stone-300 text-white py-1 px-2 m-2 w-16 rounded-lg"
                          onClick={() => openDeleteModal(player)}
                        >
                          ❌
                        </button>
                        
                        <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-600 text-white text-sm rounded inline opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Remove Player
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600">No stats added for the moment.</p>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-between mt-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 mr-2 rounded-lg"
                onClick={() => setIsAdding(true)}
              >
                Add new Player(s) to the Game
              </button>

              <div className="ml-auto space-x-4">
                <button
                  className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg"
                  onClick={handleSave}
                >
                  Save Player Stats
                </button>
                <button
                  className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-lg"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        <DeletePlayerModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          playerName={selectedPlayer?.player_name} // Pass the player name for deletion confirmation
        />
      </div>
    </div>
  );
};

export default PlayerStatsModal;
