import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AddPlayerStatsForm = ({ gameId, onSubmit, onClose }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState({});
  const [playerList, setPlayerList] = useState([]);
  const [gameStarted, setGameStarted] = useState('0');
  const [addedPlayers, setAddedPlayers] = useState([]);

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

  useEffect(() => {
    // Log addedPlayers whenever it changes
    console.log('Current added players: ', addedPlayers);
  }, [addedPlayers]);

  const handlePlayerChange = (e) => {
    setSelectedPlayer(e.target.value);
  };

  const handleStatChange = (e) => {
    const { name, value } = e.target;
    setPlayerStats({
      ...playerStats,
      [selectedPlayer]: {
        ...playerStats[selectedPlayer],
        [name]: value,
      },
    });

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

      const playerId = Number(selectedPlayer);
      const playerName = players.find(player => player.id === playerId)?.name;

      console.log('Adding player: ', playerName, ' with ID: ', playerId);

      if (!playerName) {
        console.error('Player name not found!');
        return;
      }

      setPlayerStats(prevStats => ({
        ...prevStats,
        [selectedPlayer]: {
          ...prevStats[selectedPlayer],
          gameStarted,
          gamePlayed: '1',
        },
      }));

      setAddedPlayers(prevAddedPlayers => [
        ...prevAddedPlayers,
        {
          id: selectedPlayer,
          name: playerName,
        },
      ]);

      setSelectedPlayer(null);
      setGameStarted('0');
    }
  };

  const handleEditPlayer = (playerId) => {
    setSelectedPlayer(playerId);
    setGameStarted(playerStats[playerId]?.gameStarted || '0');
  };

  const handleRemovePlayer = (playerId) => {
    setAddedPlayers(addedPlayers.filter((player) => player.id !== playerId));
    const updatedStats = { ...playerStats };
    delete updatedStats[playerId];
    setPlayerStats(updatedStats);
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
        onSubmit(addedPlayers);
        toast.success('Player stats added successfully');
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error('Failed to add player stats');
      }
    } catch (error) {
      console.error('Error adding player stats:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await fetch(`http://localhost:5000/api/games/${gameId}/player-stats`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stats: [] }),
      });

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
                  className="w-full shadow-lg border-2 border-gray-300 p-2 m-3 rounded"
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
                    className="w-full shadow-lg border-2 border-gray-300 p-2 rounded"
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
                    className="w-full shadow-lg border-2 border-gray-300 p-2 rounded"
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
                    className="w-full shadow-lg border-2 border-gray-300 p-2 rounded"
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
                    className="w-full shadow-lg border-2 border-gray-300 p-2 rounded"
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
                    className="w-full shadow-lg border-2 border-gray-300 p-2 rounded"
                    required
                  />
                </label>

                <label className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={gameStarted === '1'}
                    onChange={handleGameStartedChange}
                    className=" m-6 w-6 h-6"
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
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-semibold m-2">Added Players</h3>
                <ul>
                  {addedPlayers.map((player) => (
                  <li key={player.id} className="flex justify-between items-center py-1">
                    <span
                      className="cursor-pointer text-sky-500 hover:underline"
                      onClick={() => handleEditPlayer(player.id)}
                    >
                      {player.name}
                    </span>
                    <button
                      type="button"
                      className="text-red-500 hover:underline"
                      onClick={() => handleRemovePlayer(player.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Submit All Player Stats
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPlayerStatsForm;
