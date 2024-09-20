import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AddPlayerStatsForm from './AddPlayerStatsForm'; // Ensure correct path

const PlayerStatsModal = ({ isOpen, onClose, players, onSave, gameId }) => {
  const [editedPlayers, setEditedPlayers] = useState([]);
  const [isAdding, setIsAdding] = useState(false); // State to toggle between view modes

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
    console.log(newPlayers);
    if (Array.isArray(newPlayers)) {
      setEditedPlayers(prevPlayers => [...prevPlayers, ...newPlayers]);
      setIsAdding(false);
    } else {
      console.error('Expected newPlayers to be an array');
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
         onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-120"
           onClick={(e) => e.stopPropagation()}>
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
                    <p className="font-semibold flex items-center">
                      {player.player_name}:
                    </p>
                  </div>
            
                  <div className="flex-1 flex justify-end items-center space-x-2">
                    <div className="flex items-center">
                      <span className="ml-2">⚽️</span>
                      <input
                        type="number"
                        value={player.goals}
                        onChange={(e) => handleChange(player.player_id, 'goals', e.target.value)}
                        className="ml-2 w-16 shadow-md border-2 border-gray-300 rounded p-1 text-center"
                      />
                    </div>
            
                    <div className="flex items-center">
                      <span className="ml-2">🅰️</span>
                      <input
                        type="number"
                        value={player.assists}
                        onChange={(e) => handleChange(player.player_id, 'assists', e.target.value)}
                        className="ml-2 w-16 shadow-md border-2 border-gray-300 rounded p-1 text-center"
                      />
                    </div>
            
                    <div className="flex items-center">
                      <span className="ml-2">⏱</span>
                      <input
                        type="number"
                        value={player.minutes_played}
                        onChange={(e) => handleChange(player.player_id, 'minutes_played', e.target.value)}
                        className="ml-2 w-16 shadow-md border-2 border-gray-300 rounded p-1 text-center"
                      />
                    </div>
            
                    <div className="flex items-center">
                      <span className="ml-2">🟨</span>
                      <input
                        type="number"
                        value={player.yellow_cards}
                        onChange={(e) => handleChange(player.player_id, 'yellow_cards', e.target.value)}
                        className="ml-2 w-16 shadow-md border-2 border-gray-300 rounded p-1 text-center"
                      />
                    </div>
            
                    <div className="flex items-center">
                      <span className="ml-2">🟥</span>
                      <input
                        type="number"
                        value={player.red_cards}
                        onChange={(e) => handleChange(player.player_id, 'red_cards', e.target.value)}
                        className="ml-2 w-16 shadow-md border-2 border-gray-300 rounded p-1 text-center"
                      />
                    </div>
            
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={player.gameStarted}
                        onChange={(e) => handleChange(player.player_id, 'gameStarted', e.target.checked)}
                        className="mr-2"
                      />
                      <span>{player.gameStarted ? '🚶 Starter' : '🔄 Sub'}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            ) : (
              <p className="text-center text-gray-600">No stats added for the moment.</p>
            )}
            <div className="flex justify-between mt-4">
              {/* Left-aligned button */}
              <button 
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg" 
                onClick={() => setIsAdding(true)}>
                Add new Player(s) to the Game
              </button>

              {/* Right-aligned buttons */}
              <div className="ml-auto space-x-4">
                <button 
                  className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg" 
                  onClick={handleSave}>
                  Save changes
                </button>
                <button
                  className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-lg" 
                  onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </>
        )} 
      </div>
    </div>
  );
};

export default PlayerStatsModal;
