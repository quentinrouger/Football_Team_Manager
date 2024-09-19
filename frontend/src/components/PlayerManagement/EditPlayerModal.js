import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const formatDateForInput = (isoDate) => {
  const date = new Date(isoDate);
  const offset = date.getTimezoneOffset(); // Get the time zone offset in minutes
  date.setMinutes(date.getMinutes() - offset); // Adjust the date to compensate for the time zone difference
  return date.toISOString().split('T')[0]; // Extract and return the YYYY-MM-DD part
};

const EditPlayerModal = ({ player, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: player.name,
    birthDate: formatDateForInput(player.birthDate),
    phoneNumber: player.phoneNumber,
    mail: player.mail,
    position: player.position,
    photo: null,
    existingPhoto: player.photo,
  });

  useEffect(() => {
    setFormData({
      name: player.name,
      birthDate: formatDateForInput(player.birthDate),
      phoneNumber: player.phoneNumber,
      mail: player.mail,
      position: player.position,
      photo: null,
      existingPhoto: player.photo,
    });
  }, [player]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();

    console.log('formData:', formData);

    // Append all fields to FormData
    for (const key in formData) {
      if (key !== 'existingPhoto' && formData[key] !== null) {
        updatedFormData.append(key, formData[key]);
      }
    }

    // If no new photo, include the existing photo filename
    if (!formData.photo) {
      updatedFormData.append('existingPhoto', formData.existingPhoto);
    }

    try {
      await onSave(player.id, updatedFormData);

      toast.success('Player updated successfully!');

      setTimeout(() => {
        window.location.reload();
      }, 2000);

      onClose();
    } catch (error) {
      console.error('Error saving player:', error);
      toast.error('Error updating player.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" 
      onClick={onClose}
      >
      <div className="bg-white p-6 rounded-lg max-w-md w-full" 
        onClick={(e) => e.stopPropagation()}
        >
        <div className="overflow-y-auto max-h-[80vh] p-6">
          <h2 className="text-xl font-bold text-center mb-4">Edit Player</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="name">Name</label>
              <input
                name="name"
                id="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="shadow-lg border-2 border-gray-300 rounded-md px-3 py-2 w-full"
                required
                autoComplete="name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="birthDate">Birth Date</label>
              <input
                name="birthDate"
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="shadow-lg border-2 border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="phoneNumber">Phone Number</label>
              <input
                name="phoneNumber"
                id="phoneNumber"
                type="text"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="shadow-lg border-2 border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="mail">Email</label>
              <input
                name="mail"
                id="mail"
                type="email"
                value={formData.mail}
                onChange={handleInputChange}
                className="shadow-lg border-2 border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="position">Position</label>
              <select
                name="position"
                id="position"
                value={formData.position}
                onChange={handleInputChange}
                className="shadow-lg border-2 border-gray-300 rounded-md px-3 py-2 w-full"
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
              <label className="block text-gray-700" htmlFor="photo">Photo</label>
              <input
                name="photo"
                id="photo"
                type="file"
                onChange={handleFileChange}
                className="shadow-lg border-2 border-gray-300 rounded-md px-3 py-2 w-full"
                accept="image/*"
              />
              {formData.existingPhoto && !formData.photo && (
                <div className="mt-2">
                  <img
                    src={`http://localhost:5000/uploads/${formData.existingPhoto}`}
                    alt="Current"
                    className="w-32 h-32 object-cover shadow"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={onClose} // Close modal without saving
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

EditPlayerModal.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    birthDate: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    mail: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    photo: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditPlayerModal;
