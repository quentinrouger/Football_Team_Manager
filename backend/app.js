const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const playerRoutes = require('./routes/playerRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', authRoutes);
app.use('/api', playerRoutes);

// Email verification route
// This is to handle the email verification link that the user clicks
app.get('/api/verify-email', (req, res) => {
  const { token } = req.query;

  db.query('SELECT * FROM users WHERE verification_token = ?', [token], (err, result) => {
    if (err) return res.status(500).send('Server error');
    
    if (result.length === 0) {
      return res.status(400).send('Invalid or expired token');
    }

    const user = result[0];

    if (user.token_expiration < Date.now()) {
      return res.status(400).send('Token has expired');
    }

    db.query(
      'UPDATE users SET email_verified = 1, verification_token = NULL, token_expiration = NULL WHERE id = ?',
      [user.id],
      (err) => {
        if (err) return res.status(500).send('Server error');
        
        res.status(200).send('Email verified successfully');
      }
    );
  });
});

module.exports = app;
