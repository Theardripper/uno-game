import { success } from "#shared/helpers/response.js";
import * as scoreService from "./score.service.js";

export const createScore = async (req, res, next) => {
    try {
        const score = await scoreService.createScore(req.body);
        return success(res, score, "Score created successfully", 201);
    } catch (error) {
        next(error);
    }
};

export const getScoreById = async (req, res, next) => {
    try {
        const score = await scoreService.getScoreById(req.params.id);
        if (!score) return res.status(404).json({ error: "Score not found" });
        return success(res, score, "Score fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const updateScore = async (req, res, next) => {
    try {
        const score = await scoreService.updateScore(req.params.id, req.body);
        if (!score) return res.status(404).json({ error: "Score not found" });
        return success(res, score, "Score updated successfully");
    } catch (error) {
        next(error);
    }
};

export const deleteScore = async (req, res, next) => {
    try {
        const score = await scoreService.deleteScore(req.params.id);
        if (!score) return res.status(404).json({ error: "Score not found" });
        return success(res, null, "Score removed successfully");
    } catch (error) {
        next(error);
    }
};

export const getScoreHistory = async (req, res, next) => {
  try {
    const scores = await scoreService.getScoresByGameId(req.params.game_id);
    return success(res, scores, 'Score history fetched successfully');
  } catch (error) {
    next(error);
  }
};
