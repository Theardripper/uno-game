import Game from './game.model.js';
import { AppError } from '#shared/errors/AppError.js';

export const createGame = async (gameData, user) => {
  const data = { ...gameData };
  if (!data.game_id) {
    data.game_id = Math.floor(10000 + Math.random() * 90000);
  }
  if (user && !data.creator_username) {
    data.creator_username = user.id;
    data.players = [user.id];
  }
  const game = await Game.create(data);
  return game;
};

export const getGameById = async (id) => {
  const game = await Game.findById(id);
  if (!game) throw new AppError(`No game found with id ${id}`, 404, 'GAME_NOT_FOUND');
  return game;
};

export const updateGame = async (id, updateData) => {
  const game = await Game.findByIdAndUpdate(id, updateData, { new: true });
  if (!game) throw new AppError(`No game found with id ${id}`, 404, 'GAME_NOT_FOUND');
  return game;
};

export const deleteGame = async (id) => {
  const game = await Game.findByIdAndDelete(id);
  if (!game) throw new AppError(`No game found with id ${id}`, 404, 'GAME_NOT_FOUND');
  return game;
};

export const joinGame = async (game_id, username) => {
  const game = await Game.findOne({ game_id });
  if (!game) throw new AppError(`No game found with game_id ${game_id}`, 404, 'GAME_NOT_FOUND');

  if (!game.players.includes(username)) {
    game.players.push(username);
    if (!game.scores) game.scores = new Map();
    game.scores.set(username, 0);
    await game.save();
  }
  return game;
};

export const startGame = async (game_id, username) => {
  const game = await Game.findOne({ game_id });
  if (!game) throw new AppError(`No game found with game_id ${game_id}`, 404, 'GAME_NOT_FOUND');

  if (game.state === 'ended') {
    throw new AppError(`Game ${game_id} has already ended`, 400, 'GAME_ALREADY_ENDED');
  }

  if (game.creator_username && game.creator_username !== username) {
    throw new AppError(`Only the creator (${game.creator_username}) can start the game`, 403, 'UNAUTHORIZED');
  }

  game.state = 'in_progress';
  game.current_player = game.players[0] || username;
  await game.save();
  return game;
};

export const leaveGame = async (game_id, username) => {
  const game = await Game.findOne({ game_id });
  if (!game) throw new AppError(`No game found with game_id ${game_id}`, 404, 'GAME_NOT_FOUND');

  game.players = game.players.filter(p => p !== username);
  if (game.scores) game.scores.delete(username);
  await game.save();
  return game;
};

export const endGame = async (game_id, username) => {
  const game = await Game.findOne({ game_id });
  if (!game) throw new AppError(`No game found with game_id ${game_id}`, 404, 'GAME_NOT_FOUND');

  if (game.creator_username && game.creator_username !== username) {
    throw new AppError(`Only the creator (${game.creator_username}) can end the game`, 403, 'UNAUTHORIZED');
  }

  game.state = 'ended';
  await game.save();
  return game;
};

export const getGameState = async (game_id) => {
  const game = await Game.findOne({ game_id });
  if (!game) throw new AppError(`No game found with game_id ${game_id}`, 404, 'GAME_NOT_FOUND');
  return { game_id: game.game_id, state: game.state || 'in_progress' };
};

export const getGamePlayers = async (game_id) => {
  const game = await Game.findOne({ game_id });
  if (!game) throw new AppError(`No game found with game_id ${game_id}`, 404, 'GAME_NOT_FOUND');
  return { game_id: game.game_id, players: game.players || [] };
};

export const getPlayerHand = async (game_id) => {
  return { game_id, hand: ["Red 5", "Blue Skip", "Wild Draw Four"] };
};

export const getCurrentPlayer = async (game_id) => {
  const game = await Game.findOne({ game_id });
  if (!game) throw new AppError(`No game found with game_id ${game_id}`, 404, 'GAME_NOT_FOUND');
  return { game_id: game.game_id, current_player: game.current_player || game.players[0] || 'Player1' };
};

export const getTopCard = async (game_id) => {
  const game = await Game.findOne({ game_id });
  if (!game) throw new AppError(`No game found with game_id ${game_id}`, 404, 'GAME_NOT_FOUND');
  return { game_id: game.game_id, top_card: game.top_card || 'Ace of Spades' };
};

export const getScores = async (game_id) => {
  const game = await Game.findOne({ game_id });
  if (!game) throw new AppError(`No game found with game_id ${game_id}`, 404, 'GAME_NOT_FOUND');
  const scoresObj = game.scores ? Object.fromEntries(game.scores) : { Player1: 100, Player2: 75 };
  return { game_id: game.game_id, scores: scoresObj };
};

export const listGames = async () => {
  return await Game.find();
};
