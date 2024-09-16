const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1000000 }
});

const getPlayers = (req, res) => {
  const userId = req.user.id;
  db.query('SELECT * FROM players WHERE userId = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
const createPlayer = (req, res) => {
  const { name, birthDate, position, goals, assists, yellowCards, redCards, minutesPlayed, gamesPlayed, gamesStarted, phoneNumber, mail, notes, isInjured } = req.body;
  const photo = req.file ? req.file.filename : null; // Handle file upload
  const userId = req.user.id;
  
  const sql = 'INSERT INTO players (name, birthDate, position, userId, photo, goals, assists, yellowCards, redCards, minutesPlayed, gamesPlayed, gamesStarted, phoneNumber, mail, notes, isInjured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, birthDate, position, userId, photo, goals, assists, yellowCards, redCards, minutesPlayed, gamesPlayed, gamesStarted, phoneNumber, mail, notes, isInjured], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, birthDate, position, photo, goals, assists, yellowCards, redCards, minutesPlayed, gamesPlayed, gamesStarted, phoneNumber, mail, notes, isInjured });
  });
};

const updatePlayer = (req, res) => {
  upload.single('photo')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    console.log('Request Body:', req.body); // Log the incoming request body
    console.log('Player ID:', req.params.id); // Log the player ID
    
    const { name, birthDate, position, goals, assists, yellowCards, redCards, minutesPlayed, gamesPlayed, gamesStarted, phoneNumber, mail, notes } = req.body;
    const { id } = req.params;
    const userId = req.user.id; // Extracted from JWT
    const newPhoto = req.file ? req.file.filename : null; // New photo or null if no photo is uploaded
    const existingPhoto = req.body.existingPhoto; // Existing photo filename from the request body
    
    // Use new photo if uploaded, otherwise keep the existing photo
    const photoToUpdate = newPhoto || existingPhoto;

    // First, check if the player belongs to the logged-in user
    db.query('SELECT * FROM players WHERE id = ? AND userId = ?', [id, userId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) {
        return res.status(403).json({ message: 'You do not have permission to update this player' });
      }

      // If the player exists and belongs to the user, proceed with the update
      const sql = 'UPDATE players SET name = ?, birthDate = ?, position = ?, photo = ?, goals = ?, assists = ?, yellowCards = ?, redCards = ?, minutesPlayed = ?, gamesPlayed = ?, gamesStarted = ?, phoneNumber = ?, mail = ?, notes = ? WHERE id = ? AND userId = ?';
      db.query(sql, [name, birthDate, position, photoToUpdate, goals, assists, yellowCards, redCards, minutesPlayed, gamesPlayed, gamesStarted, phoneNumber, mail, notes, id, userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Player updated successfully' });
      });
    });
  });
};
const updatePlayerInjured = (req, res) => {

    console.log('Request Body:', req.body);
    console.log('Player ID:', req.params.id);
    
    const { isInjured, notes } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    // First, check if the player belongs to the logged-in user
    db.query('SELECT * FROM players WHERE id = ? AND userId = ?', [id, userId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) {
        return res.status(403).json({ message: 'You do not have permission to update this player' });
      }

      // If the player exists and belongs to the user, proceed with the update
      const sql = 'UPDATE players SET isInjured = ?, notes = ? WHERE id = ? AND userId = ?';
      db.query(sql, [isInjured, notes, id, userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        console.log(`Updating player ${id} with injury status ${isInjured} and notes: ${notes}`);

        res.json({ message: 'Player updated successfully' });
      });
    });
};

const deletePlayer = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // First, check if the player belongs to the logged-in user
  db.query('SELECT * FROM players WHERE id = ? AND userId = ?', [id, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to delete this player' });
    }

    const player = results[0];

    // If the player exists and belongs to the user, proceed with the deletion
    const sql = 'DELETE FROM players WHERE id = ? AND userId = ?';
    db.query(sql, [id, userId], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // Check if the player has an associated photo, and if so, delete the file
      if (player.photo) {
        const photoPath = path.join(__dirname, '..', 'uploads', player.photo);
        fs.unlink(photoPath, (fsErr) => {
          if (fsErr) {
            console.error('Error deleting file:', fsErr);
            return res.status(500).json({ error: 'Player deleted, but failed to delete the photo.' });
          }
          console.log('Photo deleted successfully');
          res.json({ message: 'Player and photo deleted successfully' });
        });
      } else {
        res.json({ message: 'Player deleted successfully' });
      }
    });
  });
};

module.exports = { getPlayers, createPlayer, updatePlayer, deletePlayer, updatePlayerInjured };
