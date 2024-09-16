import React, { useState } from 'react';

const InjuredPlayerCard = ({ player, onEditNotes, onRemovePlayer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEditNotes(player);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemovePlayer(player);
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
      {/* Only show buttons on the front side */}
      {!isFlipped && (
        <>
          {/* Edit button */}
          <button
            className="absolute top-2 left-2 bg-gray-700 hover:bg-gray-800 text-white rounded-full px-3 py-1 text-sm z-10"
            onClick={handleEditClick}
          >
            Edit notes
          </button>

          {/* Remove button */}
          <button
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1 text-sm z-10"
            onClick={handleRemoveClick}
          >
            Remove player
          </button>
        </>
      )}

      {/* Front side */}
      <div
        className={`absolute inset-0 backface-hidden rounded-xl flex flex-col justify-center items-center ${
          isFlipped ? 'transform rotate-y-180' : ''
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
        <h2 className="text-xl font-bold m-1 text-stone-200 text-center">{player.name}</h2>
        <p className="text-md font-semibold text-stone-200 text-center"> {formattedBirthDate} ({age})</p>
        <p className="text-md font-semibold text-stone-200 text-center">Position: {player.position}</p>
        <img
          src="/images/injury.png"
          alt="Medical icon"
          className="absolute bottom-0 right-0 w-10 h-10 mt-2"
          style={{ margin: '10px' }} // Optional: Add some margin if needed
        />
      </div>

      {/* Back side */}
      <div
        className={`absolute inset-0 rounded-lg backface-hidden transition-transform duration-500 ease-in-out p-7 flex flex-col justify-center items-center ${
          isFlipped ? 'block' : 'hidden'
        }`}
      >
        {/* <h2 className="text-xl font-bold mb-10 text-stone-200 text-center transform rotate-y-180">{player.name}</h2>
        <p className="text-md font-semibold text-stone-200 text-center transform rotate-y-180"> {player.notes}</p> */}
        {/* Container for name and notes */}
        <div className="flex flex-col justify-between h-full">
          {/* Name at the top */}
          <h2 className="text-xl font-bold text-stone-200 text-center transform rotate-y-180 ">
            {player.name}
          </h2>

          {/* Notes centered vertically */}
          <div className="flex-grow flex items-center justify-center">
            <p className="text-md font-semibold text-stone-200 text-center transform rotate-y-180">
              {player.notes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InjuredPlayerCard;
