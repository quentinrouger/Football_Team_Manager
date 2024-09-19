import React, { useState } from 'react';
import { toast } from 'react-toastify';

const EditNotesModal = ({ player, onSave, onClose }) => {
  const [notes, setNotes] = useState(player.notes || '');

  const handleSave = () => {
    onSave(player.id, notes);

    toast.success('Notes updated successfully!');
    setTimeout(() => {
      window.location.reload(); // Reload the page to reflect the changes
    }, 1500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
      >
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3"
        onClick={(e) => e.stopPropagation()}
        >
        <h2 className="text-xl font-bold text-center mb-4">Edit Notes for {player.name}</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-32 shadow-lg border-2 border-gray-300 p-2 rounded mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNotesModal;
