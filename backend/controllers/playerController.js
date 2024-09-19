const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1000000 } // 1 MB limit
});

const getPlayers = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const [results] = await db.query('SELECT * FROM players WHERE userId = ?', [userId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPlayer = async (req, res) => {
  const { name, birthDate, position, phoneNumber, mail, notes, isInjured } = req.body;
  const photo = req.file ? req.file.filename : null; // Handle file upload
  const userId = req.user.id;

  const sql = 'INSERT INTO players (name, birthDate, position, userId, photo, phoneNumber, mail, notes, isInjured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  try {
    const [result] = await db.query(sql, [name, birthDate, position, userId, photo, phoneNumber, mail, notes, isInjured]);
    res.json({ id: result.insertId, name, birthDate, position, photo, phoneNumber, mail, notes, isInjured });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePlayer = (req, res) => {
  // Middleware function to handle file upload
  upload.single('photo')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    const { name, birthDate, position, phoneNumber, mail, } = req.body;
    const { id } = req.params;
    const userId = req.user.id;
    const newPhoto = req.file ? req.file.filename : null; // New photo or null if no photo is uploaded
    const existingPhoto = req.body.existingPhoto;

    // Use new photo if uploaded, otherwise keep the existing photo
    const photoToUpdate = newPhoto || existingPhoto;

    try {
      // Check if the player belongs to the logged-in user
      const [results] = await db.query('SELECT * FROM players WHERE id = ? AND userId = ?', [id, userId]);

      if (results.length === 0) {
        return res.status(403).json({ message: 'You do not have permission to update this player' });
      }

      // Update player
      await db.query(
        'UPDATE players SET name = ?, birthDate = ?, position = ?, photo = ?, phoneNumber = ?, mail = ? WHERE id = ? AND userId = ?',
        [name, birthDate, position, photoToUpdate, phoneNumber, mail, id, userId]
      );

      res.json({ message: 'Player updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

const updatePlayerInjured = async (req, res) => {
  const { isInjured, notes } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if the player belongs to the logged-in user
    const [results] = await db.query('SELECT * FROM players WHERE id = ? AND userId = ?', [id, userId]);

    if (results.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to update this player' });
    }

    // Update player injury status
    await db.query(
      'UPDATE players SET isInjured = ?, notes = ? WHERE id = ? AND userId = ?',
      [isInjured, notes, id, userId]
    );

    res.json({ message: 'Player updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePlayer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if the player belongs to the logged-in user
    const [results] = await db.query('SELECT * FROM players WHERE id = ? AND userId = ?', [id, userId]);

    if (results.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to delete this player' });
    }

    const player = results[0];

    // Delete player
    await db.query('DELETE FROM players WHERE id = ? AND userId = ?', [id, userId]);

    // Check if the player has an associated photo, and if so, delete the file
    if (player.photo) {
      const photoPath = path.join(__dirname, '..', 'uploads', player.photo);
      await fs.unlink(photoPath);
      console.log('Photo deleted successfully');
    }

    res.json({ message: 'Player and photo deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPlayers, createPlayer, updatePlayer, deletePlayer, updatePlayerInjured };
