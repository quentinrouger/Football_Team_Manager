import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const username = localStorage.getItem('username');
    
    try {
      // Send DELETE request to delete user account and all associated data
      const response = await fetch('http://localhost:5000/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Clear local storage and notify user
      localStorage.clear();
      toast.success(`Account deleted successfully. Goodbye, ${username}!`, {
        position: 'top-right',
        autoClose: 2000,
      });

      // Redirect to homepage
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      toast.error('Error deleting account. Please try again.', {
        position: 'top-right',
        autoClose: 2000,
      });
      console.error('Error:', error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-[320px] h-[320px] relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">Manage Account</h2>
          <p className="text-center mt-8">
            Are you sure you want to delete your account? This action cannot be undone and will delete all your data.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full mt-10"
          >
            Delete Account
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full mt-4"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  );
};

export default DeleteAccountModal;
