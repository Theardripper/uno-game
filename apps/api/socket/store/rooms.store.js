import crypto from "crypto";

import { GameState } from "../../../shared/game/game-states.js";

/**
 * Armazenamento em memória das salas ativas.
 *
 * Enquanto a persistência (US de rooms/DB) não existe, o estado
 * vive aqui. A chave é sempre o código da sala (ex: UNO-A1B2)
 * porque é o que o cliente conhece e o que usamos como nome da
 * room no Socket.IO.
 *
 * @type {Map<string, Room>}
 */
const rooms = new Map();

/**
 * @typedef {Object} RoomPlayer
 * @property {string} id
 * @property {string} name
 * @property {string} socketId - Socket atual do player (muda a cada reconexão)
 * @property {boolean} isReady
 * @property {boolean} isHost
 * @property {boolean} connected
 *
 * @typedef {Object} Room
 * @property {string} id
 * @property {string} code
 * @property {string} hostId
 * @property {string} status
 * @property {number} maxPlayers
 * @property {RoomPlayer[]} players
 */

export function getRoom(code) {
    return rooms.get(code) || null;
}

/**
 * Cria uma sala nova já com o host dentro.
 */
export function createRoom(code, host) {
    const room = {
        id: crypto.randomUUID(),
        code,
        hostId: host.id,
        status: GameState.WAITING_FOR_PLAYERS,
        maxPlayers: 4,
        players: [],
    };

    rooms.set(code, room);

    return room;
}

export function deleteRoom(code) {
    rooms.delete(code);
}

export function findPlayer(room, playerId) {
    return room.players.find((player) => player.id === playerId) || null;
}

export function addPlayer(room, player) {
    room.players.push({
        id: player.id,
        name: player.name,
        avatarSeed: player.avatarSeed,
        level: player.level,
        socketId: player.socketId,
        isReady: false,
        isHost: player.id === room.hostId,
        connected: true,
    });
}

/**
 * Remove um player da sala.
 * Se o host sair, o player mais antigo vira o novo host.
 *
 * @returns {boolean} true se a sala ficou vazia
 */
export function removePlayer(room, playerId) {
    room.players = room.players.filter((player) => player.id !== playerId);

    if (room.players.length === 0) {
        deleteRoom(room.code);
        return true;
    }

    if (room.hostId === playerId) {
        const newHost = room.players[0];
        room.hostId = newHost.id;
        newHost.isHost = true;
    }

    return false;
}

/**
 * Snapshot enviado no SERVER_ROOM_STATE.
 * Nunca expor socketId para os clientes.
 */
export function toSnapshot(room) {
    return {
        id: room.id,
        code: room.code,
        hostId: room.hostId,
        status: room.status,
        maxPlayers: room.maxPlayers,
        players: room.players.map((player) => ({
            id: player.id,
            name: player.name,
            avatarSeed: player.avatarSeed,
            level: player.level,
            isReady: player.isReady,
            isHost: player.isHost,
            connected: player.connected,
        })),
    };
}
