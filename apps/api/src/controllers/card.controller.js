import Card from '../models/Card.js';

export const createCard = async (req, res) => {
  try {
    const card = await Card.create(req.body);
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (error) {
    res.status(400).json({ error: 'ID invalid' });
  }
};

export const updateCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json({ message: 'Card removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};