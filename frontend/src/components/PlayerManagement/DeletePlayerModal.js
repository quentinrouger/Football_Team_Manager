import React from 'react';

const DeletePlayerModal = ({ player, onConfirmDelete, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onCancel}
      >
      <div className="bg-white p-6 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        >
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete {player.name}?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => onConfirmDelete(player.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="ml-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlayerModal;
