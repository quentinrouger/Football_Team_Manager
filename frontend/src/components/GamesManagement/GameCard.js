import React, { useState } from 'react';
import PlayerStatsModal from './PlayerStatsModal';
import DeleteGameModal from './DeleteGameModal';
import { toast } from 'react-toastify';

const GameCard = ({ game }) => {
  const teamName = localStorage.getItem('teamName');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (updatedPlayers) => {
    try {
      const response = await fetch('http://localhost:5000/api/games/update-player-stats', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ game_id: game.id, stats: updatedPlayers }),
      });
      if (!response.ok) {
        throw new Error('Failed to update player stats');
      }
    } catch (error) {
      console.error('Error saving player stats:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/games/${game.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete game');
      }
      // Optionally, refresh data or handle success
      // You might want to trigger a callback to remove the game from the parent component's state
    } catch (error) {
      console.error('Error deleting game:', error);
    } finally {
      setIsDeleteModalOpen(false);
      toast.success('Game deleted successfully!');
      setTimeout(() => {
        window.location.reload();
      } , 1500);
    }
  };

  const isHome = game.location === 'Home';
  const isAway = game.location === 'Away';

  const isVictory = game.goals_for > game.goals_against;
  const isLoss = game.goals_for < game.goals_against;

  const bgColor = isVictory
    ? 'bg-gradient-to-br from-teal-600 via-emerald-500 to-teal-600'
    : isLoss
    ? 'bg-gradient-to-r from-red-400 to-red-500'
    : 'bg-gradient-to-br from-teal-200 via-gray-400 to-teal-200';

  return (
    <>
      <div
        className={`relative p-4 text-center text-stone-100 hover:scale-105 transition-transform duration-500 ease-in-out cursor-pointer rounded-lg shadow-md ${bgColor} h-64`}
        style={{ maxHeight: '16rem' }} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsButtonHovered(false);
        }}
        onClick={handleCardClick}
      >
        {isHovered && (
          <button
            className="absolute top-2 right-2 bg-stone-200 hover:bg-stone-300 text-white rounded-full p-2"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteModalOpen(true);
            }}
          >
            🗑️
          </button>
        )}
        {/* Tooltip for delete button */}
        {isButtonHovered && (
          <div className="absolute top-1 right-12 bg-gray-700 text-white text-sm p-1 rounded">
            Delete game
          </div>
        )}

        <h3 className="text-2xl font-semibold mt-5 mb-2">
          {isHome 
            ? `${teamName} ${game.goals_for} - ${game.goals_against} ${game.opponent_team}`
            : `${game.opponent_team} ${game.goals_against} - ${game.goals_for} ${teamName}`}
        </h3>
        <p>{isHome ? '🏠' : isAway ? '✈️' : ''}</p>
        <p className='font-semibold mt-2'>
          {new Date(game.date).toLocaleDateString()}
        </p>

        {game.scorers && game.scorers.length > 0 && (
          <div className="mt-2 overflow-y-auto" style={{ maxHeight: '6rem' }}>
            <ul className="list-inside">
              {game.scorers.map((scorer) => (
                <li key={scorer.player_id}>
                  {scorer.player_name} {' '}
                  {Array(scorer.goals).fill('⚽️').map((goal, index) => (
                    <span key={index}>{goal}</span>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Player stats modal */}
      {isModalOpen && (
        <PlayerStatsModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onSave={handleSave} // Pass the save handler to the form
          players={game.playerStats}
          gameId={game.id}
        />
      )}

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <DeleteGameModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          message={`Are you sure you want to delete this game and its associated player stats?`}
        />
      )}
    </>
  );
};

export default GameCard;
