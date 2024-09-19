import React, { useState } from 'react';
import PlayerStatsModal from './PlayerStatsModal';  // Import your modal component

const GameCard = ({ game }) => {
  const teamName = localStorage.getItem('teamName');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        body: JSON.stringify({ stats: updatedPlayers }),
      });
      if (!response.ok) {
        throw new Error('Failed to update player stats');
      }
      // Optionally, refresh data or handle success
    } catch (error) {
      console.error('Error saving player stats:', error);
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
        className={`p-4 text-center text-stone-100 hover:scale-105 transition-transform duration-500 ease-in-out cursor-pointer rounded-lg shadow-md ${bgColor} h-64`}
        style={{ maxHeight: '16rem' }} 
        onClick={handleCardClick}
      >
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
          players={game.playerStats}  // Pass the player stats here
        />
      )}
    </>
  );
};

export default GameCard;
