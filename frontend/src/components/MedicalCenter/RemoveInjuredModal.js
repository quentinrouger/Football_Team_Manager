import React from 'react';
import { toast } from 'react-toastify';

const RemoveInjuredModal = ({ player, onClose, onRemove }) => {
  const handleRemove = () => {
    onRemove(player);

    toast.success('Player removed from the medical center!');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Remove Player from Medical Center</h2>
        <p className="mb-4">Are you sure you want to remove {player.name} from the medical center? This action will also clear the notes.</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleRemove}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Remove player
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveInjuredModal;
