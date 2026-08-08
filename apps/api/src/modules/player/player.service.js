import Player from './player.model.js';
import { Maybe } from './maybe.js';

// Funções puras auxiliares de validação que retornam Monads
const sanitizeName = (name) => {
  if (!name || typeof name !== 'string') return Maybe.of(null);
  const cleaned = name.trim();
  return cleaned.length >= 2 ? Maybe.of(cleaned) : Maybe.of(null);
};

const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return Maybe.of(null);
  const cleaned = email.trim().toLowerCase();
  return cleaned.includes('@') ? Maybe.of(cleaned) : Maybe.of(null);
};

// Sanitização e validação encadeada (flatMap/map) usando a Monad Maybe
export const validateAndProcessPlayerData = (playerData) => {
  return Maybe.of(playerData?.name)
    .flatMap(sanitizeName)
    .flatMap((validName) =>
      Maybe.of(playerData?.email)
        .flatMap(sanitizeEmail)
        .map((validEmail) => ({
          ...playerData,
          name: validName,
          email: validEmail,
        }))
    );
};

export const createPlayer = async (playerData) => {
  const processedMaybe = validateAndProcessPlayerData(playerData);

  if (processedMaybe.isNothing()) {
    throw new Error('Dados do jogador inválidos para criação.');
  }

  const validData = processedMaybe.getOrElse(null);
  const createdPlayer = await Player.create(validData);
  return Maybe.of(createdPlayer);
};

export const getPlayerById = async (id) => {
  const player = await Player.findById(id);
  // Envolve o retorno em um Maybe para evitar chamadas nulas no controller
  return Maybe.of(player);
};

export const updatePlayer = async (id, updateData) => {
  const processedMaybe = validateAndProcessPlayerData(updateData);

  if (processedMaybe.isNothing()) {
    throw new Error('Dados do jogador inválidos para atualização.');
  }

  const validData = processedMaybe.getOrElse(null);
  const updatedPlayer = await Player.findByIdAndUpdate(id, validData, { new: true });
  return Maybe.of(updatedPlayer);
};

export const deletePlayer = async (id) => {
  const deletedPlayer = await Player.findByIdAndDelete(id);
  return Maybe.of(deletedPlayer);
};