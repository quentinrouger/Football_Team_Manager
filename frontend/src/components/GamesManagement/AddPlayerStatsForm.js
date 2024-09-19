import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AddPlayerStatsForm = ({ gameId, onSubmit, onClose }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState({});
  const [playerList, setPlayerList] = useState([]);
  const [gameStarted, setGameStarted] = useState('0'); // Initialize with '0'
  const [addedPlayers, setAddedPlayers] = useState([]); // New state for added players

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/players', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setPlayers(data);
        setPlayerList(data.map(player => ({ id: player.id, name: player.name })));
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);

  const handlePlayerChange = (e) => {
    const playerId = e.target.value;
    setSelectedPlayer(playerId);
  };

  const handleStatChange = (e) => {
    const { name, value } = e.target;
  
    // Update player stats
    setPlayerStats({
      ...playerStats,
      [selectedPlayer]: {
        ...playerStats[selectedPlayer],
        [name]: value,
      },
    });
  
    // Optional: Check if field is empty and show a message (not usually done here)
    // This example assumes you have a way to show individual field errors
    if (value.trim() === '' && name !== 'gameStarted') {
      toast.error(`${name.replace('_', ' ')} cannot be empty.`);
    }
  };

  const handleGameStartedChange = (e) => {
    setGameStarted(e.target.checked ? '1' : '0');
  };

  const handleAddPlayer = () => {
    if (selectedPlayer && !addedPlayers.find((p) => p.id === selectedPlayer)) {

      const stats = playerStats[selectedPlayer];
        if (!stats || !stats.goals || !stats.assists || !stats.minutes_played || !stats.yellow_cards || !stats.red_cards) {
        toast.error('Please fill in all stats fields for the selected player.');
      return;
  }
      // Convert selectedPlayer to a number
      const playerId = Number(selectedPlayer);
  
      // Find player by id in the players array
      const playerName = players.find(player => player.id === playerId)?.name;
  
      console.log('Adding player: ', playerName, ' with ID: ', playerId); // Debug player name
  
      if (!playerName) {
        console.error('Player name not found!');  // Log an error if playerName is undefined
        return;
      }

      // Update the state for the selected player's stats
      setPlayerStats({
        ...playerStats,
        [selectedPlayer]: {
          ...playerStats[selectedPlayer],
          gameStarted, // Include gameStarted in the player's stats
          gamePlayed: '1', // Set gamePlayed to '1' by default
        },
      });

      // Add player to the addedPlayers list
      setAddedPlayers([
        ...addedPlayers,
        {
          id: selectedPlayer,
          name: playerName,
        },
      ]);

      // Log the addedPlayers list to check if it's being updated correctly
      console.log('Current added players: ', addedPlayers);

      // Reset selected player and gameStarted for the next entry
      setSelectedPlayer(null);
      setGameStarted('0');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const statsArray = Object.keys(playerStats).map((playerId) => ({
      player_id: playerId,
      game_id: gameId,
      ...playerStats[playerId],
    }));

    try {
      const response = await fetch(`http://localhost:5000/api/games/${gameId}/player-stats`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stats: statsArray }),
      });

      if (response.ok) {
        console.log('Player stats submitted successfully');
        onSubmit();
        toast.success('Player stats added successfully');
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } else {
        throw new Error('Failed to add player stats');
      }
    } catch (error) {
      console.error('Error adding player stats:', error);
    }
  };

  const handleCancel = async () => {
    try {
      // Here, you can handle the cancel action, e.g., send an empty array or any necessary logic
      await fetch(`http://localhost:5000/api/games/${gameId}/player-stats`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stats: [] }), // Empty array for stats
      });

      toast.info('Player stats submission canceled, you can add them later.');
  
      // Close the modal or perform any other necessary actions
      onClose();
    } catch (error) {
      console.error('Error canceling player stats submission:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="overflow-y-auto max-h-[80vh] p-6">
          <h2 className="text-2xl font-bold mb-4">Add Player Stats</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">
                Add a Player:
                <select
                  value={selectedPlayer || ''}
                  onChange={handlePlayerChange}
                  className="w-full border border-gray-300 p-2 m-3 rounded"
                >
                  <option value="" disabled>Select player</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {selectedPlayer && (
              <div className="mb-4">
                <h3 className="font-semibold">Enter Stats for {playerList.find(p => p.id === selectedPlayer)?.name}</h3>

                <label className="block mb-2">
                  Goals:
                  <input
                    type="number"
                    name="goals"
                    value={playerStats[selectedPlayer]?.goals || ''}
                    onChange={handleStatChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </label>

                <label className="block mb-2">
                  Assists:
                  <input
                    type="number"
                    name="assists"
                    value={playerStats[selectedPlayer]?.assists || ''}
                    onChange={handleStatChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </label>

                <label className="block mb-2">
                  Minutes Played:
                  <input
                    type="number"
                    name="minutes_played"
                    value={playerStats[selectedPlayer]?.minutes_played || ''}
                    onChange={handleStatChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </label>

                <label className="block mb-2">
                  Yellow Cards:
                  <input
                    type="number"
                    name="yellow_cards"
                    value={playerStats[selectedPlayer]?.yellow_cards || ''}
                    onChange={handleStatChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </label>

                <label className="block mb-2">
                  Red Cards:
                  <input
                    type="number"
                    name="red_cards"
                    value={playerStats[selectedPlayer]?.red_cards || ''}
                    onChange={handleStatChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </label>

                <label className="block mb-2">
                  <input
                    type="checkbox"
                    checked={gameStarted === '1'}
                    onChange={handleGameStartedChange}
                    className="mr-2"
                  />
                  Game Started
                </label>

                <button
                  type="button"
                  onClick={handleAddPlayer}
                  className="bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600"
                >
                  Add Player Stats
                </button>
                {/* Cancel button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlayer(null);
                    setGameStarted('0');
                  }}
                  className="bg-gray-500 text-white py-2 px-4 ml-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Conditionally render this button based on the selectedPlayer state */}
            {!selectedPlayer && (
              <>
                <div className="mb-4">
                  <h3 className="font-semibold m-2">Added Players</h3>
                  <ul>
                    {addedPlayers.map((player) => (
                      <li key={player.id} className="border-b bg-gray-200 py-2 px-4">
                        ✏️ {player.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Submit All Player Stats
                </button>
                {/* New Cancel button */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white py-2 px-4 ml-2 rounded hover:bg-gray-600"
                >
                  Later 
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPlayerStatsForm;
