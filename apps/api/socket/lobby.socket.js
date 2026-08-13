import { ErrorCodes } from "../../shared/api/responses/errors.js";
import { GameState } from "../../shared/game/game-states.js";
import { GameEvents, LobbyEvents, SystemEvents } from "../../shared/socket/events.js";
import { gameEngine } from "../src/modules/game/game.engine.js";
import { processGameFinishedWithRoomCode } from "./game.socket.js";
import { broadcastGameState } from "./game.broadcaster.js";
import {
    addPlayer,
    createRoom,
    findPlayer,
    getRoom,
    removePlayer,
    toSnapshot,
} from "./store/rooms.store.js";
import Room from "../src/modules/room/room.model.js";

const MIN_PLAYERS = 2;

/**
 * Emite um erro padronizado (ErrorPayload) direto para quem errou.
 */
function emitError(socket, code, message) {
    socket.emit(SystemEvents.SERVER_ERROR, { code, message });
}

/**
 * Reenvia o snapshot completo da sala para todos os players dela.
 * O snapshot é a fonte da verdade do lobby no frontend.
 */
function broadcastRoomState(io, room) {
    io.to(room.code).emit(LobbyEvents.SERVER_ROOM_STATE, toSnapshot(room));
}

/**
 * Registra os handlers de Lobby para um socket conectado.
 *
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
export default function registerLobbySocket(io, socket) {
    const player = socket.data.player;

    /**
     * Entrada na sala (e também reconexão).
     *
     * Se a sala não existe ela é criada e quem entrou vira o host.
     * Quando a US de rooms (REST + DB) estiver pronta, a criação
     * sai daqui e este handler passa a só buscar a sala existente.
     */
    socket.on(LobbyEvents.CLIENT_JOIN_ROOM, (payload, callback) => {
        const roomCode = payload?.roomCode;

        if (!roomCode) {
            emitError(socket, ErrorCodes.INVALID_PAYLOAD, "roomCode é obrigatório");
            return callback?.({ success: false });
        }

        let room = getRoom(roomCode);

        if (!room) {
            room = createRoom(roomCode, player);
        }

        const existing = findPlayer(room, player.id);

        if (existing) {
            // Reconexão: só reatamos o socket novo ao player antigo
            existing.socketId = socket.id;
            existing.connected = true;
        } else {
            if (room.status !== GameState.WAITING_FOR_PLAYERS) {
                emitError(socket, ErrorCodes.GAME_ALREADY_STARTED, "a partida já começou");
                return callback?.({ success: false });
            }

            if (room.players.length >= room.maxPlayers) {
                emitError(socket, ErrorCodes.ROOM_FULL, "a sala está cheia");
                return callback?.({ success: false });
            }

            addPlayer(room, { ...player, socketId: socket.id });

            socket.to(roomCode).emit(LobbyEvents.SERVER_PLAYER_JOINED, {
                playerId: player.id,
                name: player.name,
            });
        }

        // Guarda a sala atual no socket para leave/disconnect/chat
        socket.data.roomCode = roomCode;
        socket.join(roomCode);
        socket.join(`player_${player.id}`);

        broadcastRoomState(io, room);

        if (room.status !== GameState.WAITING_FOR_PLAYERS) {
            const game = gameEngine.getGame(room.code);
            if (game) {
                const publicState = gameEngine.getPublicGameState(game);
                socket.emit(GameEvents.SERVER_GAME_STATE, publicState);
                
                const gamePlayer = game.players.find((p) => p.id === player.id);
                if (gamePlayer) {
                    socket.emit(GameEvents.SERVER_HAND_UPDATED, { hand: gamePlayer.hand });
                }
            }
        }

        callback?.({ success: true, room: toSnapshot(room) });
    });

    /**
     * Saída voluntária da sala.
     */
    socket.on(LobbyEvents.CLIENT_LEAVE_ROOM, (payload, callback) => {
        const room = getRoom(socket.data.roomCode);

        if (!room) return callback?.({ success: false });

        socket.leave(room.code);
        socket.data.roomCode = null;

        const isEmpty = removePlayer(room, player.id);

        if (!isEmpty) {
            io.to(room.code).emit(LobbyEvents.SERVER_PLAYER_LEFT, {
                playerId: player.id,
                name: player.name,
            });

            broadcastRoomState(io, room);

            if (room.status !== GameState.WAITING_FOR_PLAYERS) {
                const game = gameEngine.removePlayer(room.code, player.id, "PLAYER_LEFT");
                if (game) {
                    if (game.status === "finished") {
                        processGameFinishedWithRoomCode(io, game, room.code);
                    } else {
                        broadcastGameState(io, game);
                    }
                }
            }
        } else {
            Room.deleteOne({ code: room.code }).catch(console.error);
        }

        callback?.({ success: true });
    });

    /**
     * Alterna o status de "pronto" antes da partida começar.
     */
    socket.on(LobbyEvents.CLIENT_TOGGLE_READY, (payload, callback) => {
        const room = getRoom(socket.data.roomCode);
        const roomPlayer = room && findPlayer(room, player.id);

        if (!roomPlayer) {
            emitError(socket, ErrorCodes.ROOM_NOT_FOUND, "você não está em uma sala");
            return callback?.({ success: false });
        }

        roomPlayer.isReady = !roomPlayer.isReady;

        broadcastRoomState(io, room);

        callback?.({ success: true, isReady: roomPlayer.isReady });
    });

    /**
     * Host inicia a partida.
     *
     * Aqui só validamos e mudamos o status da sala. Distribuição de
     * cartas e estado do jogo em si são responsabilidade da US do
     * motor do jogo (game.socket).
     */
    socket.on(LobbyEvents.CLIENT_START_GAME, async (payload, callback) => {
        const room = getRoom(socket.data.roomCode);

        if (!room) {
            emitError(socket, ErrorCodes.ROOM_NOT_FOUND, "você não está em uma sala");
            return callback?.({ success: false });
        }

        if (room.hostId !== player.id) {
            emitError(socket, ErrorCodes.UNAUTHORIZED, "apenas o host pode iniciar");
            return callback?.({ success: false });
        }

        if (room.players.length < MIN_PLAYERS) {
            emitError(socket, ErrorCodes.INVALID_PAYLOAD, `mínimo de ${MIN_PLAYERS} players para começar`);
            return callback?.({ success: false });
        }

        const everyoneReady = room.players
            .filter((p) => p.id !== room.hostId)
            .every((p) => p.isReady);

        if (!everyoneReady) {
            emitError(socket, ErrorCodes.INVALID_PAYLOAD, "nem todos os players estão prontos");
            return callback?.({ success: false });
        }

        room.status = GameState.STARTING;
        
        try {
            await Room.updateOne({ code: room.code }, { status: 'in_progress' });
        } catch (error) {
            console.error("Failed to update MongoDB status:", error);
        }
        
        broadcastRoomState(io, room);

        try {
            const game = gameEngine.initializeGame(room.code, room.players);
            
            io.to(room.code).emit(GameEvents.SERVER_GAME_STARTED, { roomCode: room.code });
            broadcastGameState(io, game);
            
            callback?.({ success: true });
        } catch (error) {
            emitError(socket, ErrorCodes.INTERNAL_SERVER_ERROR, error.message);
            callback?.({ success: false });
        }
    });

    /**
     * Host remove um player da sala.
     */
    socket.on(LobbyEvents.CLIENT_KICK_PLAYER, (payload, callback) => {
        const room = getRoom(socket.data.roomCode);
        const targetId = payload?.playerId;

        if (!room || room.hostId !== player.id) {
            emitError(socket, ErrorCodes.UNAUTHORIZED, "apenas o host pode remover players");
            return callback?.({ success: false });
        }

        const target = targetId && findPlayer(room, targetId);

        if (!target || targetId === room.hostId) {
            emitError(socket, ErrorCodes.INVALID_PAYLOAD, "player inválido");
            return callback?.({ success: false });
        }

        const targetSocket = io.sockets.sockets.get(target.socketId);

        if (targetSocket) {
            targetSocket.emit(SystemEvents.SERVER_NOTIFICATION, {
                type: "warning",
                message: "você foi removido da sala pelo host",
            });

            targetSocket.leave(room.code);
            targetSocket.data.roomCode = null;
        }

        removePlayer(room, targetId);

        io.to(room.code).emit(LobbyEvents.SERVER_PLAYER_LEFT, {
            playerId: targetId,
            name: target.name,
        });

        broadcastRoomState(io, room);

        callback?.({ success: true });
    });

    /**
     * Queda de conexão.
     *
     * O player não é removido na hora: fica marcado como
     * desconectado para permitir a reconexão via CLIENT_JOIN_ROOM.
     */
    socket.on("disconnect", () => {
        const room = getRoom(socket.data.roomCode);
        const roomPlayer = room && findPlayer(room, player.id);

        if (!roomPlayer) return;

        roomPlayer.connected = false;

        io.to(room.code).emit(LobbyEvents.SERVER_PLAYER_LEFT, {
            playerId: player.id,
            name: player.name,
            reason: "disconnected",
        });

        broadcastRoomState(io, room);
    });
}
