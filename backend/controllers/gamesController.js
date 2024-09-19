const mysql = require('mysql2/promise');
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
  db.query(
    `SELECT 
       g.*, 
       pms.player_id, pms.goals, pms.assists, pms.minutes_played, pms.yellow_cards, pms.red_cards, pms.gamePlayed, pms.gameStarted, 
       p.name AS player_name 
     FROM games g
     LEFT JOIN player_match_stats pms ON g.id = pms.game_id
     LEFT JOIN players p ON p.id = pms.player_id`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      // Aggregate data by game
      const games = results.reduce((acc, row) => {
        const game = acc.find((g) => g.id === row.id);
        const scorer = row.goals > 0 ? { player_id: row.player_id, player_name: row.player_name, goals: row.goals } : null;

        const playerStat = {
          player_id: row.player_id,
          player_name: row.player_name,
          goals: row.goals,
          assists: row.assists,
          minutes_played: row.minutes_played,
          yellow_cards: row.yellow_cards,
          red_cards: row.red_cards,
          gameStarted: row.gameStarted,
        };

        if (game) {
          // Add scorer to the existing game
          if (scorer) {
            // Check if the scorer already exists to prevent duplicates
            const existingScorer = game.scorers.find(s => s.player_id === scorer.player_id);
            if (existingScorer) {
              existingScorer.goals += scorer.goals;
            } else {
              game.scorers.push(scorer);
            }
          }
          if (playerStat.player_id) game.playerStats.push(playerStat);
        } else {
          // Create a new game entry
          acc.push({
            id: row.id,
            date: row.date,
            opponent_team: row.opponent_team,
            location: row.location,
            goals_for: row.goals_for,
            goals_against: row.goals_against,
            playerStats: playerStat.player_id ? [playerStat] : [],
            scorers: scorer ? [scorer] : [],
          });
        }

        return acc;
      }, []);

      res.json(games);
    }
  );
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

// const updatePlayerStats = (req, res) => {
//   const { stats } = req.body;

//   if (!Array.isArray(stats)) {
//     return res.status(400).json({ error: 'Invalid stats format' });
//   }

//   // Update player stats in the database
//   const queries = stats.map(({ player_id, goals, assists, minutes_played, yellow_cards, red_cards, gameStarted }) =>
//     `UPDATE player_match_stats 
//      SET goals = ${goals}, assists = ${assists}, minutes_played = ${minutes_played}, yellow_cards = ${yellow_cards}, red_cards = ${red_cards}, gameStarted = ${gameStarted ? 1 : 0} 
//      WHERE player_id = ${player_id}`
//   );

//   db.query(queries.join('; '), (err) => {
//     if (err) {
//       console.error('SQL Error:', err);
//       return res.status(500).json({ error: 'Failed to update player stats' });
//     }
//     res.json({ message: 'Player stats updated successfully' });
//   });
// };
const updatePlayerStats = async (req, res) => {
  const { stats } = req.body;

  if (!Array.isArray(stats)) {
    return res.status(400).json({ error: 'Invalid stats format' });
  }

  const connection = await db.getConnection(); // Get a connection from the pool

  try {
    await connection.beginTransaction();

    for (const stat of stats) {
      const { player_id, goals, assists, minutes_played, yellow_cards, red_cards, gameStarted } = stat;

      const [results] = await connection.execute(
        'UPDATE player_match_stats SET goals = ?, assists = ?, minutes_played = ?, yellow_cards = ?, red_cards = ?, gameStarted = ? WHERE player_id = ?',
        [goals, assists, minutes_played, yellow_cards, red_cards, gameStarted ? 1 : 0, player_id]
      );

      // Check if rows were affected
      if (results.affectedRows === 0) {
        throw new Error(`No rows updated for player_id ${player_id}`);
      }
    }

    await connection.commit();
    res.json({ message: 'Player stats updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating player stats:', error);
    res.status(500).json({ error: 'Failed to update player stats' });
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

// Export the controller functions
module.exports = { addGame, addPlayerMatchStats, getAllGames, getPlayerStats, getGameMatchStats, updatePlayerStats };
