import * as cardService from './card.service.js';
import { success } from '#shared/helpers/response.js';

export const createCard = async (req, res, next) => {
  try {
    const card = await cardService.createCard(req.body);
    return success(res, card, 'Card created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getCardById = async (req, res, next) => {
  try {
    const card = await cardService.getCardById(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    return success(res, card, 'Card fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (req, res, next) => {
  try {
    const card = await cardService.updateCard(req.params.id, req.body);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    return success(res, card, 'Card updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const card = await cardService.deleteCard(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    return success(res, null, 'Card removed successfully');
  } catch (error) {
    next(error);
  }
};
