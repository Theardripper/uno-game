import { AppError } from "#shared/errors/AppError.js";
import Room from "./room.model.js";

const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "UNO-";
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

export const createRoom = async (hostId, data) => {
    const room = await Room.create({
        code: generateCode(),
        hostId,
        maxPlayers: data.maxPlayers || 4,
        isPrivate: data.isPrivate || false,
        password: data.password || null,
        players: [hostId],
    });
    return room;
};

export const validateRoomCode = async (code) => {
    const room = await Room.findOne({ code });
    if (!room) {
        throw new AppError("Sala não encontrada", 404);
    }

    if (room.status !== "waiting") {
        throw new AppError("Jogo já iniciado ou finalizado", 409);
    }

    if (room.players.length >= room.maxPlayers) {
        throw new AppError("Sala cheia", 409);
    }

    return room;
};

export const updateRoom = async (id, hostId, data) => {
    const room = await Room.findById(id);
    if (!room) {
        throw new AppError("Sala não encontrada", 404);
    }
    if (room.hostId !== hostId) {
        throw new AppError("Apenas o host pode atualizar a sala", 403);
    }

    if (data.maxPlayers !== undefined) room.maxPlayers = data.maxPlayers;
    if (data.isPrivate !== undefined) room.isPrivate = data.isPrivate;
    if (data.password !== undefined) room.password = data.password;

    await room.save();
    return room;
};

export const deleteRoom = async (id, hostId) => {
    const room = await Room.findById(id);
    if (!room) {
        throw new AppError("Sala não encontrada", 404);
    }
    if (room.hostId !== hostId) {
        throw new AppError("Apenas o host pode excluir a sala", 403);
    }

    await room.deleteOne();
    return true;
};
