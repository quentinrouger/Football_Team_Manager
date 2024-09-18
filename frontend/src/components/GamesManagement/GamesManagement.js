import React, { useEffect, useState } from 'react';
import GameForm from './GameForm';
import AddPlayerStatsForm from './AddPlayerStatsForm';
import GameCard from './GameCard';
import NavBar from '../NavBar/NavBar';

const Games = () => {
  const [games, setGames] = useState([]);
  const [currentStep, setCurrentStep] = useState('viewGames'); // Manage steps
  const [newGameId, setNewGameId] = useState(null);
  const [showForm, setShowForm] = useState(false); // Manage form visibility

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.statusText}`);
        }

        const data = await response.json();

        const sortedGames = data.sort((a, b) => new Date(b.date) - new Date(a.date));

        setGames(sortedGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  const handleGameSubmit = (gameId) => {
    setNewGameId(gameId);
    setCurrentStep('addPlayerStats');
    setShowForm(false);
  };

  const handleAddGame = () => {
    setShowForm(true);
    setCurrentStep('addGame');
  };

  const handleStatsSubmit = () => {
    // Optionally refetch games
    setShowForm(false);
    setCurrentStep('viewGames'); // Reset the step to view games after stats are submitted
  };
  

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentStep('viewGames'); // Reset step when the form is closed
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('/images/background.png')" }}>
      <NavBar />
      <div className="container mx-auto p-4 flex-grow">
        <h1 className="text-6xl text-white text-center font-bold m-12">Games</h1>
        
          <>
            <button
              onClick={handleAddGame}
              className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 ml-10"
            >
              Add New Game
            </button>
            <div className="grid w-full h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 mt-10">
              {games.length > 0 ? (
                games.map((game) => (
                  <div key={game.id} className="h-full w-full">
                    <GameCard game={game} />
                  </div>
                ))
              ) : (
                <p className='text-xl m-1 font-semibold text-stone-200'>No games found.</p>
              )}
            </div>
          </>

        {showForm && currentStep === 'addGame' && (
          <GameForm
            onSubmit={handleGameSubmit}
            onClose={handleCloseForm}
          />
        )}

        {currentStep === 'addPlayerStats' && (
          <AddPlayerStatsForm
            gameId={newGameId}
            onSubmit={handleStatsSubmit}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
};

export default Games;
