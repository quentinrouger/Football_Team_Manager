import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const AddPlayerForm = ({ addPlayer }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [position, setPosition] = useState('');
  const [photo, setPhoto] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mail, setMail] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('birthDate', birthDate);
    formData.append('position', position);
    formData.append('photo', photo);
    formData.append('phoneNumber', phoneNumber);
    formData.append('mail', mail);
    formData.append('notes', '');
    formData.append('isInjured', 0);

    addPlayer(formData);

    // Clear the form fields
    setName('');
    setBirthDate('');
    setPosition('');
    setPhoto(null);
    setPhoneNumber('');
    setMail('');
    setIsFormVisible(false);

    toast.success('Player created successfully!');
  };

  const handleClose = () => {
    setIsFormVisible(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsFormVisible(true)}
        className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80"
      >
        Add New Player
      </button>

      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleClose}
          >
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-80" 
            onClick={(e) => e.stopPropagation()}
            >
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-center mb-4">Add New Player</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow-lg appearance-none border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-500 leading-tight "
                  required
                  autoComplete="name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthDate">
                  Birth Date
                </label>
                <input
                  type="date"
                  id="birthDate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="shadow-lg appearance-none border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
                  Position
                </label>
                <select
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="shadow-lg appearance-none border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  required
                >
                  <option value="" disabled>Select Position</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Defender">Defender</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Forward">Forward</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="shadow-lg appearance-none border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mail">
                  Email
                </label>
                <input
                  type="email"
                  id="mail"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  className="shadow-lg appearance-none border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                  Photo
                </label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  className="shadow-lg appearance-none border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight"
                />
              </div>

              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Player
              </button>
              <button
                onClick={handleClose}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

AddPlayerForm.propTypes = {
  addPlayer: PropTypes.func.isRequired,
};

export default AddPlayerForm;
