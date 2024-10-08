const express = require('express');
const { 
  addGame, 
  updateGame,
  addPlayerMatchStats, 
  getAllGames, 
  getGameMatchStats, 
  updatePlayerStats,
  getPlayerStats,
  deletePlayerMatchStats,
  deleteGame
} = require('../controllers/gamesController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Route to add a new game
// Endpoint: POST /games/add
router.post('/games/add', verifyToken, addGame);

// Route to update a game
// Endpoint: PUT /games/:game_id
router.put('/games/:game_id', verifyToken, updateGame);

// Route to delete a game
// Endpoint: DELETE /games/:game_id
router.delete('/games/:game_id', verifyToken, deleteGame);

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
router.put('/games/:game_id/stats', verifyToken, updatePlayerStats);

// Route to delete player match stats for a specific game and player
// Endpoint: DELETE /games/:game_id/player-stats/:player_id
router.delete('/games/:game_id/player-stats/:player_id', verifyToken, deletePlayerMatchStats);

module.exports = router;
