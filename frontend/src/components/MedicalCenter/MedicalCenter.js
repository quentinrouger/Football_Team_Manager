import React, { useEffect, useState } from 'react';
import InjuredPlayerCard from './InjuredPlayerCard';
import NavBar from '../NavBar/NavBar';
import SelectPlayerModal from './SelectPlayerModal';
import EditNotesModal from './EditNotesModal';
import RemoveInjuredModal from './RemoveInjuredModal';

const MedicalCenter = () => {
  const [players, setPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

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

        if (!response.ok) {
          throw new Error(`Failed to fetch players: ${response.statusText}`);
        }

        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);

  const handleAddToMedicalCenter = () => {
    setShowModal(true);
  };

  const handleSelectPlayer = (player, notes) => {
    setShowModal(false);
    updatePlayerInjuryStatus(player.id, notes);
  };

  const updatePlayerInjuryStatus = async (id, notes) => {
    try {
      const response = await fetch(`http://localhost:5000/api/players/${id}/injured`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isInjured: 1, notes }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update player injury status:', errorText);
        throw new Error(`Failed to update player injury status: ${response.statusText}`);
      }

      const updatedPlayer = await response.json();
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === updatedPlayer.id ? updatedPlayer : player
        )
      );
    } catch (error) {
      console.error('Error updating player injury status:', error);
    }
  };

  const handleEditNotes = (player) => {
    setSelectedPlayer(player);
    setShowEditModal(true);
  };

  const handleSaveNotes = async (id, notes) => {
    await updatePlayerInjuryStatus(id, notes);
    setShowEditModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPlayer(null);
  };

  // Remove player from the medical center by updating the injury status
  const handleRemovePlayer = async (player) => {
    try {
      const response = await fetch(`http://localhost:5000/api/players/${player.id}/injured`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isInjured: 0, notes: '' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to remove player from medical center:', errorText);
        throw new Error(`Failed to remove player from medical center: ${response.statusText}`);
      }

      const updatedPlayer = await response.json();
      setPlayers((prevPlayers) =>
        prevPlayers.filter((p) => p.id !== updatedPlayer.id)
      );
    } catch (error) {
      console.error('Error removing player from medical center:', error);
    } finally {
      setShowRemoveModal(false); // Close the remove modal
      setSelectedPlayer(null); // Clear selected player
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.png')" }}
    >
      <NavBar />
      <div className="container mx-auto p-4 flex-grow">
        <h1 className="text-6xl text-white text-center font-bold m-12">Medical Center</h1>
        <button
          onClick={handleAddToMedicalCenter}
          // className="bg-red-500 text-white py-2 px-4 rounded mb-6 ml-10"
          className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 ml-10"
        >
          Add Player to Medical Center
        </button>
        <div className="grid w-full h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 mt-10">
          {players.length > 0 ? (
            players.filter(player => player.isInjured === 1).map((player) => (
              <div key={player.id} className="h-full w-full">
                <InjuredPlayerCard
                  player={player}
                  onEditNotes={handleEditNotes}
                  onRemovePlayer={() => {
                    setSelectedPlayer(player);
                    setShowRemoveModal(true);
                  }}
                />
              </div>
            ))
          ) : (
            <p className='text-xl m-1 font-semibold text-stone-200'>No players found.</p>
          )}
        </div>
        {showModal && (
          <SelectPlayerModal
            players={players}
            onSelect={handleSelectPlayer}
            onClose={() => setShowModal(false)}
          />
        )}
        {showEditModal && selectedPlayer && (
          <EditNotesModal
            player={selectedPlayer}
            onSave={handleSaveNotes}
            onClose={handleCloseEditModal}
          />
        )}
        {showRemoveModal && selectedPlayer && (
          <RemoveInjuredModal
            player={selectedPlayer}
            onClose={() => setShowRemoveModal(false)}
            onRemove={handleRemovePlayer}
          />
        )}
      </div>
    </div>
  );
};

export default MedicalCenter;
