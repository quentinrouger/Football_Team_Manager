import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PlayerCard = ({ player, onEditPlayer, onDeletePlayer }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    total_goals: 0,
    total_assists: 0,
    total_minutes_played: 0,
    total_yellow_cards: 0,
    total_red_cards: 0,
    total_games_played: 0,
  });

  // Fetch player stats from the player_match_stats table
  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/playerStats/${player.id}`, {
          method: 'GET',
          credentials: 'include', // include cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`Failed to fetch player stats: ${response.statusText}`);
        }

        // Parse the JSON response and update player stats
        const data = await response.json();
        setPlayerStats(data);
      } catch (error) {
        console.error('Error fetching player stats:', error);
      }
    };

    fetchPlayerStats();
  }, [player.id]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEditPlayer(player);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDeletePlayer(player);
  };

  const photoUrl = player.photo
    ? `http://localhost:5000/uploads/${player.photo}`
    : '/images/default-profile.png';

  const positionColors = {
    Goalkeeper: 'bg-gradient-to-br from-slate-600 via-stone-500 to-slate-600',
    Defender: 'bg-gradient-to-br from-teal-600 via-emerald-500 to-teal-600',
    Midfielder: 'bg-gradient-to-br from-indigo-500 via-cyan-500 to-indigo-500',
    Forward: 'bg-gradient-to-br from-orange-600 via-amber-500 to-orange-600',
  };

  const cardColor = positionColors[player.position] || 'bg-gradient-to-r from-gray-400 to-gray-600';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formattedBirthDate = formatDate(player.birthDate);
  const age = calculateAge(player.birthDate);

  return (
    <div
      className={`relative rounded-xl shadow-xl max-w-sm w-full h-full border-4  from-stone-400 to-stone-400 cursor-pointer transform-style-preserve-3d transition-transform duration-500 ease-in-out ${
        isFlipped ? 'transform rotate-y-180' : 'hover:scale-105'
      } ${cardColor}`}
      onClick={handleFlip}
      style={{ perspective: '1000px' }}
    >
      {!isFlipped && (
        <>
          <button
            className="absolute top-2 left-2 bg-gray-700 hover:bg-gray-800 text-white rounded-full px-3 py-1 text-sm z-10"
            onClick={handleEditClick}
          >
            Edit
          </button>

          <button
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1 text-sm z-10"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </>
      )}

      <div
        className={`absolute inset-0 backface-hidden rounded-xl flex flex-col justify-center items-center ${
          isFlipped ? 'hidden' : 'block'
        }`}
      >
        <div className="w-42 h-42 p-1">
          <img
            src={photoUrl}
            alt={player.name}
            className="w-full h-full object-cover rounded-full border-2 shadow-xl"
            style={{ objectFit: 'cover', width: '190px', height: '190px' }}
          />
        </div>
        <h2 className="text-xl font-bold m-2 text-stone-200 text-center">{player.name}</h2>
        <p className="text-md font-semibold text-stone-200 text-center"> {formattedBirthDate} ({age})</p>
        <p className="text-md font-semibold text-stone-200 text-center">Position: {player.position}</p>
      </div>

      <div
        className={`absolute inset-0 rounded-lg backface-hidden transition-transform duration-500 ease-in-out p-7 flex flex-col justify-center items-center ${
          isFlipped ? 'block' : 'hidden'
        }`}
      >
        <h2 className="text-xl font-bold m-2 text-stone-200 text-center transform rotate-y-180">{player.name}</h2>
        <p className="text-md m-1 font-semibold text-stone-200 text-center transform rotate-y-180">Phone: {player.phoneNumber}</p>
        <p className="text-md m-1 font-semibold text-stone-200 text-center transform rotate-y-180">Email: {player.mail}</p>
        <hr width="100%" />
        <p className="text-md m-1 font-semibold text-stone-200 text-center transform rotate-y-180">
          Games Played: {playerStats.total_games_played}
        </p>
        <p className="text-md m-1 font-semibold text-stone-200 text-center transform rotate-y-180">
          Goals: {playerStats.total_goals}
        </p>
        <p className="text-md m-1 font-semibold text-stone-200 text-center transform rotate-y-180">
          Assists: {playerStats.total_assists}
        </p>
        <p className="text-md m-1 font-semibold text-stone-200 text-center transform rotate-y-180">
          Yellow Cards: {playerStats.total_yellow_cards}
        </p>
        <p className="text-md m-1 font-semibold text-stone-200 text-center transform rotate-y-180">
          Red Cards: {playerStats.total_red_cards}
        </p>
      </div>
    </div>
  );
};

PlayerCard.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    photo: PropTypes.string,
    birthDate: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string,
    mail: PropTypes.string,
  }).isRequired,
  onEditPlayer: PropTypes.func.isRequired,
  onDeletePlayer: PropTypes.func.isRequired,
};

export default PlayerCard;
