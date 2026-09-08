import { success } from "#shared/helpers/response.js";
import * as playerService from "./player.service.js";
import * as scoreService from "../score/score.service.js";

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
        return success(res, { player: player.toPublicJSON() }, "Current player fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req, res, next) => {
    try {
        const player = await playerService.updatePlayer(req.user.id, req.body);
        if (!player) return res.status(404).json({ error: "Player not found" });
        return success(res, { player: player.toPublicJSON() }, "Player updated successfully");
    } catch (error) {
        next(error);
    }
};

export const getStats = async (req, res, next) => {
  try {
    const scores = await scoreService.getScoresByPlayerId(req.user.id);
    const totalMatches = scores.length;
    const wins = scores.filter(s => s.result === 'Victory').length;
    const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : 0;

    const stats = {
      totalMatches,
      wins,
      winRate,
      totalCardsPlayed: 0, // Pending feature implementation
      totalCardsDrawn: 0,  // Pending feature implementation
      timesShoutedUno: 0,  // Pending feature implementation
    };
    return success(res, { stats }, 'Player stats fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const scores = await scoreService.getScoresByPlayerId(req.user.id);
    
    // Map the database scores to the format expected by the frontend
    const history = scores.map((score, index) => {
      // Calculate timeAgo roughly or just return the date for the frontend to handle
      // We can use a simple timeAgo function or just return the ISO string
      return {
        id: score.id || score._id.toString(),
        result: score.result,
        duration: score.duration,
        players: score.playersCount,
        timeAgo: score.timestamp.toISOString(),
        score: score.score,
        xpEarned: score.xpEarned,
        gameCode: score.gameId
      };
    });

    return success(res, { history }, 'Player history fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getPlayerById = async (req, res, next) => {
    try {
        const player = await playerService.getPlayerById(req.params.id);
        if (!player) return res.status(404).json({ error: "Player not found" });
        return success(res, { player: player.toPublicJSON() }, "Player fetched successfully");
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
