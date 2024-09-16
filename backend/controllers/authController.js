const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // For generating the verification token
const nodemailer = require('nodemailer'); // For sending the verification email
const db = require('../config/db');
const generateToken = require('../config/jwt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const registerUser = async (req, res) => {
  const { username, email, password, teamName } = req.body;

  try {
    // Check if the user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate a verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Insert the new user into the database, including the verification token and expiration
      db.query(
        'INSERT INTO users (username, email, password, teamName, verification_token, token_expiration) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, hashedPassword, teamName, verificationToken, tokenExpiration],
        async (err, result) => {
          if (err) throw err;

          // Setup the email transporter
          const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const verificationUrl = `http://localhost:5000/api/verify-email?token=${verificationToken}`;

          // Send the verification email
          await transporter.sendMail({
            from: '"Football Team Manager" <process.env.EMAIL_USER>',
            to: email,
            subject: 'Email Verification',
            html: `Please verify your email by clicking the following link: <a href="${verificationUrl}">${verificationUrl}</a>`
          });

          // Respond with a success message
          res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const user = result[0];

      // Check if the email is verified
      if (!user.email_verified) {
        return res.status(400).json({ message: 'Email not verified. Please check your email.' });
      }

      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = generateToken(user.id);

      // Set the token in an HttpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,  // Ensures the cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
        sameSite: 'strict', // Mitigates CSRF attacks by preventing cross-origin requests
        maxAge: 3600000 // 1 hour, same as the token expiration
      });

      // Respond with user details, including teamName
      res.json({ user: { id: user.id, username: user.username, email: user.email, teamName: user.teamName } });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  // Ensure this is set only in production
    sameSite: 'Strict',
  });
  res.status(200).json({ message: 'Logout successful' });
}

// Verify email function
const verifyEmail = (req, res) => {
  const { token } = req.query;

  db.query('SELECT * FROM users WHERE verification_token = ?', [token], (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const user = result[0];

    if (user.token_expiration < Date.now()) {
      return res.status(400).json({ message: 'Token expired' });
    }

    db.query(
      'UPDATE users SET email_verified = 1, verification_token = NULL, token_expiration = NULL WHERE id = ?',
      [user.id],
      (err) => {
        if (err) throw err;
        res.status(200).json({ message: 'Email verified successfully' });
      }
    );
  });
};

// Delete user function
const deleteUser = (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ message: 'User ID not found in token' });
  }

  try {
    // Step 1: Fetch all players associated with the user
    db.query('SELECT * FROM players WHERE userId = ?', [userId], (err, players) => {
      if (err) throw err;

      // Step 2: Delete associated player photos from the file system
      players.forEach((player) => {
        const photoPath = path.join(__dirname, '..', 'uploads', player.photo);
        fs.unlink(photoPath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting photo:', err);
          }
        });
      });

      // Step 3: Delete the players from the database
      db.query('DELETE FROM players WHERE userId = ?', [userId], (err) => {
        if (err) throw err;

        // Step 4: Delete the user from the database
        db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
          if (err) throw err;

          // Step 5: Respond with a success message
          res.status(200).json({ message: 'Account and associated players deleted successfully.' });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting account' });
  }
};

const changeUsername = (req, res) => {
  const userId = req.user?.id;
  const { username } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID not found in token' });
  }

  try {
    db.query('UPDATE users SET username = ? WHERE id = ?', [username, userId], (err) => {
      if (err) throw err;
      res.status(200).json({ message: 'Username updated successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating username' });
  }
}

const changeTeamName = (req, res) => {
  const userId = req.user?.id;
  const { teamName } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID not found in token' });
  }

  try {
    db.query('UPDATE users SET teamName = ? WHERE id = ?', [teamName, userId], (err) => {
      if (err) throw err;
      res.status(200).json({ message: 'Team name updated successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating team name' });
  }
}

module.exports = { registerUser, loginUser, logoutUser, verifyEmail, deleteUser, changeUsername, changeTeamName };
