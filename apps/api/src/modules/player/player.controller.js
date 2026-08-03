import { success } from "#shared/helpers/response.js";
import * as playerService from "./player.service.js";

export const createPlayer = async (req, res, next) => {
    try {
        const player = await playerService.createPlayer(req.body);
        return success(res, player, "Player created successfully", 201);
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const player = await playerService.getPlayerById(req.user.id);
        if (!player) return res.status(404).json({ error: "Player not found" });
        return success(res, player, "Current player fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = {
      totalMatches: 42,
      wins: 15,
      winRate: 35.7,
      totalCardsPlayed: 1450,
      totalCardsDrawn: 890,
      timesShoutedUno: 22,
    };
    return success(res, { stats }, 'Player stats fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    return success(res, { history: [] }, 'Player history fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getPlayerById = async (req, res, next) => {
    try {
        const player = await playerService.getPlayerById(req.params.id);
        if (!player) return res.status(404).json({ error: "Player not found" });
        return success(res, player, "Player fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const updatePlayer = async (req, res, next) => {
    try {
        const player = await playerService.updatePlayer(req.params.id, req.body);
        if (!player) return res.status(404).json({ error: "Player not found" });
        return success(res, player, "Player updated successfully");
    } catch (error) {
        next(error);
    }
};

export const deletePlayer = async (req, res, next) => {
    try {
        const player = await playerService.deletePlayer(req.params.id);
        if (!player) return res.status(404).json({ error: "Player not found" });
        return success(res, null, "Player removed successfully");
    } catch (error) {
        next(error);
    }
};
