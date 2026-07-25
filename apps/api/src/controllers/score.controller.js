import Score from '../models/Score.js';

export const createScore = async (req, res) => {
  try {
    const score = await Score.create(req.body);
    res.status(201).json(score);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getScoreById = async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) return res.status(404).json({ error: 'Score not found' });
    res.json(score);
  } catch (error) {
    res.status(400).json({ error: 'ID invalid' });
  }
};

export const updateScore = async (req, res) => {
  try {
    const score = await Score.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!score) return res.status(404).json({ error: 'Score not found' });
    res.json(score);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteScore = async (req, res) => {
  try {
    const score = await Score.findByIdAndDelete(req.params.id);
    if (!score) return res.status(404).json({ error: 'Score not found' });
    res.json({ message: 'Score removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};