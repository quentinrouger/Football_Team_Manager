import React, { useState } from 'react';
import DeleteAccountModal from './DeleteAccountModal';
import ChangeUsernameModal from './ChangeUsernameModal';
import ChangeTeamNameModal from './ChangeTeamNameModal';


const SettingsMenu = ({ isOpen, onClose }) => {
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isUsernameOpen, setUsernameOpen] = useState(false);
  const [isTeamNameOpen, setTeamNameOpen] = useState(false);

  const openModal = (modalType) => {
    switch (modalType) {
      case 'delete':
        setDeleteOpen(true);
        break;
      case 'username':
        setUsernameOpen(true);
        break;
      case 'teamName':
        setTeamNameOpen(true);
        break;
      default:
        break;
    }
  };

  const closeModal = (modalType) => {
    switch (modalType) {
      case 'delete':
        setDeleteOpen(false);
        break;
      case 'username':
        setUsernameOpen(false);
        break;
      case 'teamName':
        setTeamNameOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 h-80 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-10 text-center">Settings</h2>
          <button
            onClick={() => openModal('username')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full mb-4"
          >
            Change Username
          </button>
          <button
            onClick={() => openModal('teamName')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full mb-4"
          >
            Change Team Name
          </button>
          <button
            onClick={() => openModal('delete')}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            Delete Account
          </button>
        </div>

        {/* Modals */}
        <DeleteAccountModal isOpen={isDeleteOpen} onClose={() => closeModal('delete')} />
        <ChangeUsernameModal isOpen={isUsernameOpen} onClose={() => closeModal('username')} />
        <ChangeTeamNameModal isOpen={isTeamNameOpen} onClose={() => closeModal('teamName')} />
      </div>
    )
  );
};

export default SettingsMenu;
