const express = require('express');
const { getPlayers, createPlayer, updatePlayer, deletePlayer, updatePlayerInjured } = require('../controllers/playerController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../config/uploadConfig');

const router = express.Router();

router.get('/players',verifyToken, getPlayers);
router.post('/players', upload.single('photo'), verifyToken, createPlayer);
router.put('/players/:id', verifyToken, updatePlayer);
router.put('/players/:id/injured', verifyToken, updatePlayerInjured);

router.delete('/players/:id', verifyToken, deletePlayer);

module.exports = router;
