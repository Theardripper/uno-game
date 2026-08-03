import Card from './card.model.js';

export const createCard = async (cardData) => {
  return await Card.create(cardData);
};

export const getCardById = async (id) => {
  return await Card.findById(id);
};

export const updateCard = async (id, updateData) => {
  return await Card.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteCard = async (id) => {
  return await Card.findByIdAndDelete(id);
};
