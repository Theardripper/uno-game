import Score from './score.model.js';

export const createScore = async (scoreData) => {
  return await Score.create(scoreData);
};

export const getScoreById = async (id) => {
  return await Score.findById(id);
};

export const updateScore = async (id, updateData) => {
  return await Score.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteScore = async (id) => {
  return await Score.findByIdAndDelete(id);
};

export const getScoresByGameId = async (game_id) => {
  return await Score.find({ game_id });
};
