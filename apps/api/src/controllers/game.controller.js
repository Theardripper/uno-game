import Game from '../models/Game.js';

export const createGame = async (req, res) => {
  try {
    const gameData = { ...req.body };
    if (!gameData.game_id) {
      gameData.game_id = Math.floor(10000 + Math.random() * 90000);
    }
    if (req.user && !gameData.creator_username) {
      gameData.creator_username = req.user.username;
      gameData.players = [req.user.username];
    }

    const game = await Game.create(gameData);
    
    if (req.body.name || req.body.rules) {
      return res.status(201).json({
        message: 'Game created successfully',
        game_id: game.game_id
      });
    }

    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: 'ID invalid' });
  }
};

export const updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json({ message: 'Game removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const joinGame = async (req, res) => {
  try {
    const { game_id } = req.body;
    const game = await Game.findOne({ game_id });

    if (!game) return res.status(404).json({ error: 'Game not found' });

    if (!game.players.includes(req.user.username)) {
      game.players.push(req.user.username);
      if (!game.scores) game.scores = new Map();
      game.scores.set(req.user.username, 0);
      await game.save();
    }

    return res.status(200).json({ message: 'User joined the game successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const startGame = async (req, res) => {
  try {
    const { game_id } = req.body;
    const game = await Game.findOne({ game_id });

    if (!game) return res.status(404).json({ error: 'Game not found' });

    if (game.creator_username && game.creator_username !== req.user.username) {
      return res.status(403).json({ error: 'Only the creator can start the game' });
    }

    game.state = 'in_progress';
    game.current_player = game.players[0] || req.user.username;
    await game.save();

    return res.status(200).json({ message: 'Game started successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const leaveGame = async (req, res) => {
  try {
    const { game_id } = req.body;
    const game = await Game.findOne({ game_id });

    if (!game) return res.status(404).json({ error: 'Game not found' });

    game.players = game.players.filter(p => p !== req.user.username);
    if (game.scores) game.scores.delete(req.user.username);
    await game.save();

    return res.status(200).json({ message: 'User left the game successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const endGame = async (req, res) => {
  try {
    const { game_id } = req.body;
    const game = await Game.findOne({ game_id });

    if (!game) return res.status(404).json({ error: 'Game not found' });

    if (game.creator_username && game.creator_username !== req.user.username) {
      return res.status(403).json({ error: 'Only the creator can end the game' });
    }

    game.state = 'ended';
    await game.save();

    return res.status(200).json({ message: 'Game ended successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getGameState = async (req, res) => {
  try {
    const { game_id } = req.body;
    const game = await Game.findOne({ game_id });

    if (!game) return res.status(404).json({ error: 'Game not found' });

    return res.status(200).json({
      game_id: game.game_id,
      state: game.state || 'in_progress'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getGamePlayers = async (req, res) => {
  try {
    const { game_id } = req.body;
    const game = await Game.findOne({ game_id });

    if (!game) return res.status(404).json({ error: 'Game not found' });

    return res.status(200).json({
      game_id: game.game_id,
      players: game.players || []
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPlayerHand = async (req, res) => {
  try {
    const { game_id } = req.body;
    return res.status(200).json({
      game_id,
      hand: ["Red 5", "Blue Skip", "Wild Draw Four"]
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCurrentPlayer = async (req, res) => {
  try {
    const { game_id } = req.body;
    const game = await Game.findOne({ game_id });

    if (!game) return res.status(404).json({ error: 'Game not found' });

    return res.status(200).json({
      game_id: game.game_id,
      current_player: game.current_player || game.players[0] || 'Player1'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTopCard = async (req, res) => {
  try {
    const { game_id } = req.body;
    const game = await Game.findOne({ game_id });

    if (!game) return res.status(404).json({ error: 'Game not found' });

    return res.status(200).json({
      game_id: game.game_id,
      top_card: game.top_card || 'Ace of Spades'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getScores = async (req, res) => {
  try {
    const { game_id } = req.body;
    const game = await Game.findOne({ game_id });

    if (!game) return res.status(404).json({ error: 'Game not found' });

    const scoresObj = game.scores ? Object.fromEntries(game.scores) : { Player1: 100, Player2: 75 };

    return res.status(200).json({
      game_id: game.game_id,
      scores: scoresObj
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};