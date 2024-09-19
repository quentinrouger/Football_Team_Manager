const express = require('express');
const { 
  addGame, 
  addPlayerMatchStats, 
  getAllGames, 
  getGameMatchStats, 
  updatePlayerStats,
  getPlayerStats
} = require('../controllers/gamesController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Route to add a new game
// Endpoint: POST /games/add
router.post('/games/add', verifyToken, addGame);

// Route to add player match stats for a specific game
// Endpoint: POST /games/:game_id/player-stats
router.post('/games/:game_id/player-stats', verifyToken, addPlayerMatchStats);

// Route to get all games
// Endpoint: GET /games
router.get('/games', verifyToken, getAllGames);

// Route to get player stats by player ID
// Endpoint: GET /playerStats/:player_id
router.get('/playerStats/:player_id', verifyToken, getPlayerStats);

// Route to get match stats for a specific game
// Endpoint: GET /games/:game_id/stats
router.get('/games/:game_id/stats', verifyToken, getGameMatchStats);

// Route to update player match stats for a specific game and player
// Endpoint: PUT /games/:game_id/player-stats/:player_stats_id/:player_id
router.put('/games/update-player-stats', verifyToken, updatePlayerStats);

module.exports = router;
