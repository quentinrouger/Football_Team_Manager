import React from 'react';

const GameCard = ({ game }) => {
  const teamName = localStorage.getItem('teamName');

  const isHome = game.location === 'Home';
  const isAway = game.location === 'Away';

  // Determine the result of the game
  const isVictory = game.goals_for > game.goals_against;
  const isLoss = game.goals_for < game.goals_against;

  // Set the background color based on the result
  const bgColor = isVictory
    ? 'bg-gradient-to-br from-teal-600 via-emerald-500 to-teal-600'
    : isLoss
    ? 'bg-gradient-to-r from-red-400 to-red-500'
    : 'bg-gradient-to-br from-teal-200 via-gray-400 to-teal-200';

  return (
    <div className={`p-4 text-center text-stone-100 cursor-pointer rounded-lg shadow-md ${bgColor}`}>
      <h3 className="text-2xl font-semibold">
        {isHome 
          ? `${teamName} ${game.goals_for} - ${game.goals_against} ${game.opponent_team}`
          : `${game.opponent_team} ${game.goals_against} - ${game.goals_for} ${teamName}`}
      </h3>
      <p>{new Date(game.date).toLocaleDateString()}</p>
      <p>
        {isHome ? '🏠 Home' : isAway ? '✈️ Away' : ''}
      </p>
    </div>
  );
};

export default GameCard;
