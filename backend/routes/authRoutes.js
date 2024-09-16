const express = require('express');
const { registerUser, loginUser, logoutUser, verifyEmail, deleteUser, changeUsername, changeTeamName } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/check-auth', verifyToken, (req, res) => {
  res.json({ isAuthenticated: true, user: req.user });
});
router.post('/logout', logoutUser);
router.get('/verify-email', verifyEmail);
router.delete('/delete-account', verifyToken, deleteUser);
router.put('/change-username', verifyToken, changeUsername);
router.put('/change-team-name', verifyToken, changeTeamName);

module.exports = router;
