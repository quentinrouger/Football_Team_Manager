const db = require('../config/db');

const addGame = (req, res) => {
  const { date, opponent_team, location, goals_for, goals_against } = req.body;

  db.query(
    'INSERT INTO games (date, opponent_team, location, goals_for, goals_against) VALUES (?, ?, ?, ?, ?)',
    [date, opponent_team, location, goals_for, goals_against],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Game added successfully', gameId: result.insertId });
    }
  );
};

const addPlayerMatchStats = (req, res) => {
  const { stats } = req.body;  // Extract stats array from request body

  if (!Array.isArray(stats)) {
    return res.status(400).json({ error: 'Invalid stats format' });
  }

  // Handle empty array case
  if (stats.length === 0) {
    // For an empty array, you might want to do nothing or send a specific message
    return res.json({ message: 'No player stats to add' });
  }

  // Prepare query for bulk insertion
  const values = stats.map(({ game_id, player_id, goals, assists, minutes_played, yellow_cards, red_cards, gamePlayed, gameStarted }) => 
    [game_id, player_id, goals, assists, minutes_played, yellow_cards, red_cards, gamePlayed, gameStarted]
  );

  // Use query to insert all stats at once
  db.query(
    `INSERT INTO player_match_stats (game_id, player_id, goals, assists, minutes_played, yellow_cards, red_cards, gamePlayed, gameStarted) 
     VALUES ?`,
    [values],
    (err) => {
      if (err) {
        console.error('SQL Error:', err); // Log the actual error
        return res.status(500).json({ error: 'Failed to add player match stats' });
      }
      res.json({ message: 'Player match stats added successfully' });
    }
  );
};



const getAllGames = (req, res) => {
  db.query('SELECT * FROM games', (err, games) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(games);
  });
};

// Fetch aggregated player stats based on player ID
const getPlayerStats = (req, res) => {
  const { player_id } = req.params;

  db.query(
    `SELECT 
       player_id,
       SUM(goals) AS total_goals,
       SUM(assists) AS total_assists,
       SUM(minutes_played) AS total_minutes_played,
       SUM(yellow_cards) AS total_yellow_cards,
       SUM(red_cards) AS total_red_cards,
       SUM(gamePlayed) AS total_games_played,
       SUM(gameStarted) AS total_games_started
     FROM player_match_stats
     WHERE player_id = ?
     GROUP BY player_id`,
    [player_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'No stats found for this player' });
      
      res.json(results[0]); // Return the first result since we grouped by player_id
    }
  );
};

// Fetch match stats for a specific game
const getGameMatchStats = (req, res) => {
  const { game_id } = req.params;

  db.query(
    'SELECT pms.*, p.name AS player_name FROM player_match_stats pms JOIN players p ON pms.player_id = p.id WHERE pms.game_id = ?',
    [game_id],
    (err, matchStats) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(matchStats);
    }
  );
};

// Update player match stats, including the new fields
const updatePlayerMatchStats = (req, res) => {
  const { game_id, player_id } = req.params;
  const { goals, assists, minutes_played, yellow_cards, red_cards, gamePlayed, gameStarted } = req.body;

  db.query(
    `UPDATE player_match_stats 
     SET goals = ?, assists = ?, minutes_played = ?, yellow_cards = ?, red_cards = ?, gamePlayed = ?, gameStarted = ? 
     WHERE game_id = ? AND player_id = ?`,
    [goals, assists, minutes_played, yellow_cards, red_cards, gamePlayed, gameStarted, game_id, player_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'No player match stats found to update' });
      }

      res.json({ message: 'Player match stats updated successfully' });
    }
  );
};

// Export the controller functions
module.exports = { addGame, addPlayerMatchStats, getAllGames, getPlayerStats, getGameMatchStats, updatePlayerMatchStats };
