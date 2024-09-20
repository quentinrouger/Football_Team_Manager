import React from 'react';

const DeleteGameModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
        <p>{message}</p>

        <div className="flex justify-end mt-6 space-x-4">
          <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg" onClick={onConfirm}>
            Yes, delete
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGameModal;
