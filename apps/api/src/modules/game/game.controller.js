import * as gameService from './game.service.js';
import { success } from '#shared/helpers/response.js';

export const createGame = async (req, res, next) => {
  try {
    const game = await gameService.createGame(req.body, req.user);
    const hasNameOrRules = req.body.name || req.body.rules;

    if (hasNameOrRules) {
      return res.status(201).json({
        message: 'Game created successfully',
        game_id: game.game_id
      });
    }
    return success(res, game, 'Game created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getGameById = async (req, res, next) => {
  try {
    const game = await gameService.getGameById(req.params.id);
    return success(res, game, 'Game fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateGame = async (req, res, next) => {
  try {
    const game = await gameService.updateGame(req.params.id, req.body);
    return success(res, game, 'Game updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteGame = async (req, res, next) => {
  try {
    await gameService.deleteGame(req.params.id);
    return res.json({ message: 'Game removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const joinGame = async (req, res, next) => {
  try {
    await gameService.joinGame(req.body.game_id, req.user.id);
    return res.status(200).json({ message: 'User joined the game successfully' });
  } catch (error) {
    next(error);
  }
};

export const startGame = async (req, res, next) => {
  try {
    await gameService.startGame(req.body.game_id, req.user.id);
    return res.status(200).json({ message: 'Game started successfully' });
  } catch (error) {
    next(error);
  }
};

export const leaveGame = async (req, res, next) => {
  try {
    await gameService.leaveGame(req.body.game_id, req.user.id);
    return res.status(200).json({ message: 'User left the game successfully' });
  } catch (error) {
    next(error);
  }
};

export const endGame = async (req, res, next) => {
  try {
    await gameService.endGame(req.body.game_id, req.user.id);
    return res.status(200).json({ message: 'Game ended successfully' });
  } catch (error) {
    next(error);
  }
};

export const getGameState = async (req, res, next) => {
  try {
    const state = await gameService.getGameState(req.body.game_id);
    return res.status(200).json(state);
  } catch (error) {
    next(error);
  }
};

export const getGamePlayers = async (req, res, next) => {
  try {
    const players = await gameService.getGamePlayers(req.body.game_id);
    return res.status(200).json(players);
  } catch (error) {
    next(error);
  }
};

export const getPlayerHand = async (req, res, next) => {
  try {
    const hand = await gameService.getPlayerHand(req.body.game_id);
    return res.status(200).json(hand);
  } catch (error) {
    next(error);
  }
};

export const getCurrentPlayer = async (req, res, next) => {
  try {
    const currentPlayer = await gameService.getCurrentPlayer(req.body.game_id);
    return res.status(200).json(currentPlayer);
  } catch (error) {
    next(error);
  }
};

export const getTopCard = async (req, res, next) => {
  try {
    const topCard = await gameService.getTopCard(req.body.game_id);
    return res.status(200).json(topCard);
  } catch (error) {
    next(error);
  }
};

export const getScores = async (req, res, next) => {
  try {
    const scores = await gameService.getScores(req.body.game_id);
    return res.status(200).json(scores);
  } catch (error) {
    next(error);
  }
};