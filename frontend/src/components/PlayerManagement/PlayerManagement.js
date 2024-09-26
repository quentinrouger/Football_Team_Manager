import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PlayerCard from './PlayerCard';
import AddPlayerForm from './AddPlayerForm';
import NavBar from '../NavBar/NavBar';
import EditPlayerModal from './EditPlayerModal';
import DeletePlayerModal from './DeletePlayerModal';

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [deletingPlayer, setDeletingPlayer] = useState(null);

  const fetchPlayers = async () => {
    try {

      // Make the fetch request to get players
      const response = await fetch('http://localhost:5000/api/players', {
        method: 'GET', 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
    });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to fetch players: ${response.statusText}`);
      }

      // Parse and update the state with player data
      const data = await response.json();
      setPlayers(data);
      setFilteredPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  // useEffect to fetch players from the server
  useEffect(() => {

    fetchPlayers();
  }, []);

  // Function to add a new player
  const addPlayer = async (formData) => {
    try {
      // Same here: No need to manually handle JWT tokens
      const response = await fetch('http://localhost:5000/api/players', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      // Handle response
      if (!response.ok) {
        throw new Error(`Failed to add player: ${response.statusText}`);
      }

      // Update the players list with the newly added player
      const data = await response.json();
      setPlayers((prevPlayers) => [...prevPlayers, data]);
      setFilteredPlayers((prevPlayers) => [...prevPlayers, data]);
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  // Function to update an existing player
  const updatePlayer = async (id, updatedFormData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/players/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: updatedFormData,
      });

      // Handle response
      if (!response.ok) {
        throw new Error(`Failed to update player: ${response.statusText}`);
      }

      // Update the state with the updated player data
      const updatedPlayerData = await response.json();
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => (player.id === updatedPlayerData.id ? updatedPlayerData : player))
      );
      setFilteredPlayers((prevPlayers) =>
        prevPlayers.map((player) => (player.id === updatedPlayerData.id ? updatedPlayerData : player))
      );

      await fetchPlayers();
      setEditingPlayer(null);
    } catch (error) {
      console.error('Error updating player:', error);
    }
  };

  // Function to delete a player
  const deletePlayer = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/players/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete player: ${response.statusText}`);
      }

      // Remove the player from the list after successful deletion
      setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== id));
      setFilteredPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== id));
      setDeletingPlayer(null);

      toast.success('Player deleted successfully!');

    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
  };

  // Helper function to handle player deletion
  const handleDeletePlayer = (player) => {
    setDeletingPlayer(player);
  };

  // Handle filtering players based on position
  const handlePositionChange = (e) => {
    const position = e.target.value;
    setSelectedPosition(position);

    if (position === '') {
      setFilteredPlayers(players);
    } else {
      // Filter players based on the selected position
      const filtered = players.filter(player => player.position === position);
      setFilteredPlayers(filtered);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/images/Homepage2-.png')" }}
    >
      <NavBar />
      <div className="container mt-24 mx-auto p-4 flex-grow">
        <div className="flex justify-between items-center mb-6 ml-10">
          {/* AddPlayerForm */}
          <div>
            <AddPlayerForm addPlayer={addPlayer} />
          </div>

          {/* Position Dropdown for filtering */}
          <div>
            <select
              value={selectedPosition}
              onChange={handlePositionChange}
              className="border border-gray-300 hover:bg-neutral-200 rounded-md px-3 py-2 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
              id="position"
            >
              <option value="">All Positions</option>
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Defender">Defender</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Forward">Forward</option>
            </select>
          </div>
        </div>

        {/* Render players */}
        <div className="grid w-full h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 mt-10">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
              <div key={player.id} className="h-full w-full">
                <PlayerCard player={player} onEditPlayer={handleEditPlayer} onDeletePlayer={handleDeletePlayer} />
              </div>
            ))
          ) : (
            <p className='text-xl m-1 font-semibold text-stone-200'>No players found.</p>
          )}
        </div>

        {editingPlayer && (
          <EditPlayerModal
            player={editingPlayer}
            onSave={updatePlayer}
            onClose={() => setEditingPlayer(null)}
          />
        )}

        {deletingPlayer && (
          <DeletePlayerModal
            player={deletingPlayer}
            onConfirmDelete={deletePlayer}
            onCancel={() => setDeletingPlayer(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PlayerManagement;
