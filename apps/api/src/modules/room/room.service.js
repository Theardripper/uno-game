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
        isPrivate: data.isPrivate !== undefined ? data.isPrivate : true,
        password: data.password || null,
        players: [hostId],
    });
    return room;
};

export const validateRoomCode = async (code) => {
    const room = await Room.findOne({ code });
    if (!room) {
        throw new AppError(`No room found with code ${code}`, 404, "ROOM_NOT_FOUND");
    }

    if (room.status !== "waiting") {
        throw new AppError(`Room ${code} is not accepting players: status is ${room.status}`, 409, "GAME_ALREADY_STARTED");
    }

    if (room.players.length >= room.maxPlayers) {
        throw new AppError(`Room ${code} is full: ${room.maxPlayers} players already joined`, 409, "ROOM_FULL");
    }

    return room;
};

export const getRoomByCode = async (code) => {
    const room = await Room.findOne({ code }).lean();
    if (!room) {
        throw new AppError(`No room found with code ${code}`, 404, "ROOM_NOT_FOUND");
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

    room.id = room._id.toString();
    return room;
};

export const getPublicRooms = async () => {
    const rooms = await Room.find({ isPrivate: false, status: "waiting" }).lean();
    
    // Fetch player details for hosts
    const hostIds = rooms.map(r => r.hostId);
    const Player = (await import("../player/player.model.js")).default;
    const hosts = await Player.find({ _id: { $in: hostIds } }).lean();
    
    const hostMap = hosts.reduce((acc, h) => {
        acc[h._id.toString()] = h;
        return acc;
    }, {});

    return rooms
        .filter(room => hostMap[room.hostId]) // Ignora salas órfãs de contas apagadas/inexistentes
        .map(room => {
            const host = hostMap[room.hostId];
            return {
                ...room,
                id: room._id.toString(),
                currentPlayers: room.players.length,
                hostName: host.name,
                hostTag: host.tag,
                hostAvatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${host.avatar_seed}`
            };
        });
};

export const joinRoom = async (code, playerId) => {
    const room = await Room.findOne({ code });
    if (!room) {
        throw new AppError(`No room found with code ${code}`, 404, "ROOM_NOT_FOUND");
    }

    if (room.status !== "waiting") {
        throw new AppError(`Room ${code} is not accepting players: status is ${room.status}`, 409, "GAME_ALREADY_STARTED");
    }

    if (room.players.includes(playerId)) {
        return room;
    }

    if (room.players.length >= room.maxPlayers) {
        throw new AppError(`Room ${code} is full: ${room.maxPlayers} players already joined`, 409, "ROOM_FULL");
    }

    room.players.push(playerId);
    await room.save();
    return room;
};

export const updateRoom = async (id, hostId, data) => {
    const room = await Room.findById(id);
    if (!room) {
        throw new AppError(`No room found with id ${id}`, 404, "ROOM_NOT_FOUND");
    }
    if (room.hostId !== hostId) {
        throw new AppError(`Only the host (${room.hostId}) can update this room`, 403, "UNAUTHORIZED");
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
        throw new AppError(`No room found with id ${id}`, 404, "ROOM_NOT_FOUND");
    }
    if (room.hostId !== hostId) {
        throw new AppError(`Only the host (${room.hostId}) can delete this room`, 403, "UNAUTHORIZED");
    }

    await room.deleteOne();
    return true;
};

export const leaveRoom = async (code, playerId) => {
    const room = await Room.findOne({ code });
    if (!room) {
        throw new AppError(`No room found with code ${code}`, 404, "ROOM_NOT_FOUND");
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
