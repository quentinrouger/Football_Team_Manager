import React from 'react';

const DeletePlayerModal = ({ isOpen, onClose, onConfirm, playerName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-center mb-4">Confirm</h2>
        <p>Are you sure you want to remove {playerName} from this game?</p>

        <div className="flex justify-end mt-6 space-x-4">
          <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg" onClick={onConfirm}>
            Yes, remove
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlayerModal;
