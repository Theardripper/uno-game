import Player from './player.model.js';

export const createPlayer = async (playerData) => {
  return await Player.create(playerData);
};

export const getPlayerById = async (id) => {
  return await Player.findById(id);
};

export const updatePlayer = async (id, updateData) => {
  return await Player.findByIdAndUpdate(id, updateData, { new: true });
};

export const deletePlayer = async (id) => {
  return await Player.findByIdAndDelete(id);
};
