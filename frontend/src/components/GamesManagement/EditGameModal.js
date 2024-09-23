// import React, { useState } from 'react';

// const EditGameModal = ({ isOpen, onClose, onSave, game }) => {
//   const [editedGame, setEditedGame] = useState({
//     goals_for: game.goals_for,
//     goals_against: game.goals_against,
//     location: game.location,
//     opponent_team: game.opponent_team,
//     date: new Date(game.date).toISOString().substring(0, 10),
//   });

//   const handleChange = (e) => {
//     setEditedGame({
//       ...editedGame,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSaveGame = () => {
//     onSave(editedGame);
//   };

//   return isOpen ? (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
//       <div className="bg-white p-4 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
//         <h2 className="text-xl font-semibold text-center mb-4">Edit Game</h2>
//         <div className="mb-2">
//           <label>Opponent Team :</label>
//           <input
//             type="text"
//             name="opponent_team"
//             value={editedGame.opponent_team}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />
//         </div>
//         <div className="mb-2">
//           <label>Goals For :</label>
//           <input
//             type="number"
//             name="goals_for"
//             value={editedGame.goals_for}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />
//         </div>
//         <div className="mb-2">
//           <label>Goals Against :</label>
//           <input
//             type="number"
//             name="goals_against"
//             value={editedGame.goals_against}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />
//         </div>
//         <div className="mb-2">
//           <label>Location :</label>
//           <select
//             name="location"
//             value={editedGame.location}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           >
//             <option value="Home">Home</option>
//             <option value="Away">Away</option>
//           </select>
//         </div>
//         <div className="mb-2">
//           <label>Date :</label>
//           <input
//             type="date"
//             name="date"
//             value={editedGame.date}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />
//         </div>
//         <div className="flex justify-start mt-4">
//         <button onClick={handleSaveGame} className="p-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
//           <button onClick={onClose} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
//         </div>
//       </div>
//     </div>
//   ) : null;
// };

// export default EditGameModal;

import React, { useState } from 'react';

const EditGameModal = ({ isOpen, onClose, onSave, game }) => {
  const [editedGame, setEditedGame] = useState({
    goals_for: game.goals_for,
    goals_against: game.goals_against,
    location: game.location,
    opponent_team: game.opponent_team,
    date: new Date(game.date).toISOString().substring(0, 10),
  });

  const handleChange = (e) => {
    setEditedGame({
      ...editedGame,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveGame = () => {
    onSave(editedGame);
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-4 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-center mb-4">Edit Game</h2>
        <div className="mb-2">
          <label>Opponent Team :</label>
          <input
            type="text"
            name="opponent_team"
            value={editedGame.opponent_team}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-2">
          <label>Goals For :</label>
          <input
            type="number"
            name="goals_for"
            value={editedGame.goals_for}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-2">
          <label>Goals Against :</label>
          <input
            type="number"
            name="goals_against"
            value={editedGame.goals_against}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-2">
          <label>Location :</label>
          <select
            name="location"
            value={editedGame.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Home">Home</option>
            <option value="Away">Away</option>
          </select>
        </div>
        <div className="mb-2">
          <label>Date :</label>
          <input
            type="date"
            name="date"
            value={editedGame.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex justify-start mt-4">
          <button onClick={handleSaveGame} className="p-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
          <button onClick={onClose} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditGameModal;
