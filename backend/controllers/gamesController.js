const db = require('../config/db');

const addGame = async (req, res) => {
  const { date, opponent_team, location, goals_for, goals_against } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO games (date, opponent_team, location, goals_for, goals_against) VALUES (?, ?, ?, ?, ?)',
      [date, opponent_team, location, goals_for, goals_against]
    );
    res.json({ message: 'Game added successfully', gameId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addPlayerMatchStats = async (req, res) => {
  const { stats } = req.body;

  if (!Array.isArray(stats)) {
    return res.status(400).json({ error: 'Invalid stats format' });
  }

  // Handle empty array case
  if (stats.length === 0) {
    return res.json({ message: 'No player stats to add' });
  }

  const values = stats.map(({ game_id, player_id, goals, assists, minutes_played, yellow_cards, red_cards, gamePlayed, gameStarted }) => 
    [game_id, player_id, goals, assists, minutes_played, yellow_cards, red_cards, gamePlayed, gameStarted]
  );

  try {
    await db.query(
      `INSERT INTO player_match_stats (game_id, player_id, goals, assists, minutes_played, yellow_cards, red_cards, gamePlayed, gameStarted) 
       VALUES ?`,
      [values]
    );
    res.json({ message: 'Player match stats added successfully' });
  } catch (err) {
    console.error('SQL Error:', err);
    res.status(500).json({ error: 'Failed to add player match stats' });
  }
};

const getAllGames = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT 
         g.*, 
         pms.player_id, pms.goals, pms.assists, pms.minutes_played, pms.yellow_cards, pms.red_cards, pms.gamePlayed, pms.gameStarted, 
         p.name AS player_name 
       FROM games g
       LEFT JOIN player_match_stats pms ON g.id = pms.game_id
       LEFT JOIN players p ON p.id = pms.player_id`
    );

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
        if (scorer) {
          const existingScorer = game.scorers.find(s => s.player_id === scorer.player_id);
          if (existingScorer) {
            existingScorer.goals += scorer.goals;
          } else {
            game.scorers.push(scorer);
          }
        }
        if (playerStat.player_id) game.playerStats.push(playerStat);
      } else {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPlayerStats = async (req, res) => {
  const { player_id } = req.params;

  try {
    const [results] = await db.query(
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
      [player_id]
    );
    
    if (results.length === 0) return res.status(404).json({ message: 'No stats found for this player' });
    
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGameMatchStats = async (req, res) => {
  const { game_id } = req.params;

  try {
    const [matchStats] = await db.query(
      'SELECT pms.*, p.name AS player_name FROM player_match_stats pms JOIN players p ON pms.player_id = p.id WHERE pms.game_id = ?',
      [game_id]
    );
    res.json(matchStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePlayerStats = async (req, res) => {
  const { game_id, stats } = req.body; // Get game_id from request body

  if (!game_id || !Array.isArray(stats)) {
    return res.status(400).json({ error: 'Invalid game_id or stats format' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (const stat of stats) {
      const { player_id, goals, assists, minutes_played, yellow_cards, red_cards, gameStarted } = stat;

      const [results] = await connection.execute(
        'UPDATE player_match_stats SET goals = ?, assists = ?, minutes_played = ?, yellow_cards = ?, red_cards = ?, gameStarted = ? WHERE player_id = ? AND game_id = ?', // Add game_id to the WHERE clause
        [goals, assists, minutes_played, yellow_cards, red_cards, gameStarted ? 1 : 0, player_id, game_id] // Include game_id in the parameters
      );

      if (results.affectedRows === 0) {
        throw new Error(`No rows updated for player_id ${player_id} in game_id ${game_id}`);
      }
    }

    await connection.commit();
    res.json({ message: 'Player stats updated successfully' });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating player stats:', error);
    res.status(500).json({ error: 'Failed to update player stats' });
  } finally {
    connection.release();
  }
};


module.exports = { addGame, addPlayerMatchStats, getAllGames, getPlayerStats, getGameMatchStats, updatePlayerStats };
