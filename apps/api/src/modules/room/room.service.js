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

export const getRoomByCode = async (code) => {
    const room = await Room.findOne({ code }).lean();
    if (!room) {
        throw new AppError("Sala não encontrada", 404);
    }
    
    // Fetch player details
    const Player = (await import("../player/player.model.js")).default;
    const players = await Player.find({ _id: { $in: room.players } });
    
    // Format the players like toPublicJSON
    room.playerDetails = players.map(p => ({
        id: p._id.toString(),
        name: p.name,
        tag: p.tag,
        avatarSeed: `https://api.dicebear.com/9.x/avataaars/svg?seed=${p.avatar_seed}`,
        level: p.level,
        ready: room.readyPlayers ? room.readyPlayers.includes(p._id.toString()) : false
    }));

    return room;
};

export const joinRoom = async (code, playerId) => {
    const room = await Room.findOne({ code });
    if (!room) {
        throw new AppError("Sala não encontrada", 404);
    }

    if (room.status !== "waiting") {
        throw new AppError("Jogo já iniciado ou finalizado", 409);
    }

    if (room.players.includes(playerId)) {
        return room;
    }

    if (room.players.length >= room.maxPlayers) {
        throw new AppError("Sala cheia", 409);
    }

    room.players.push(playerId);
    await room.save();
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

export const leaveRoom = async (code, playerId) => {
    const room = await Room.findOne({ code });
    if (!room) {
        throw new AppError("Sala não encontrada", 404);
    }

    if (!room.players.includes(playerId)) {
        return await getRoomByCode(code);
    }

    room.players = room.players.filter(id => id !== playerId);
    if (room.readyPlayers) {
        room.readyPlayers = room.readyPlayers.filter(id => id !== playerId);
    }
    
    if (room.players.length === 0) {
        await room.deleteOne();
        return null;
    }

    if (room.hostId === playerId) {
        room.hostId = room.players[0];
    }

    await room.save();
    return await getRoomByCode(code);
};

export const togglePlayerReady = async (code, playerId) => {
    const room = await Room.findOne({ code });
    if (!room) {
        throw new AppError("Sala não encontrada", 404);
    }

    if (!room.readyPlayers) {
        room.readyPlayers = [];
    }

    const isReady = room.readyPlayers.includes(playerId);
    if (isReady) {
        room.readyPlayers = room.readyPlayers.filter(id => id !== playerId);
    } else {
        room.readyPlayers.push(playerId);
    }
    
    await room.save();
    return await getRoomByCode(code);
};
