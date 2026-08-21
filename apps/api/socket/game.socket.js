import { ErrorCodes } from "../../shared/api/responses/errors.js";
import { GameEvents, SystemEvents } from "../../shared/socket/events.js";
import { calculateXpEarned, getLevel } from "../../shared/utils/progression.js";
import { gameEngine } from "../src/modules/game/game.engine.js";
import Player from "../src/modules/player/player.model.js";
import Room from "../src/modules/room/room.model.js";
import { broadcastGameState } from "./game.broadcaster.js";
import { getRoom } from "./store/rooms.store.js";

/**
 * Processa a finalização de um jogo, contabilizando o XP, atualizando DB
 * e emitindo o evento final para o cliente.
 */
export async function processGameFinishedWithRoomCode(io, game, roomCode) {
    if (game.status !== "finished") return;

    try {
        const results = [];
        const allPlayers = [...game.players, ...(game.removedPlayers || [])];

        for (const player of allPlayers) {
            const score = game.matchScores?.[player.id] || 0;

            let resultType = "LOSS";
            if (player.id === game.winnerId) {
                resultType = game.endReason === "PLAYER_LEFT" ? "WO" : "WIN";
            }

            const xpEarned = calculateXpEarned(score, resultType);

            // Atualiza o banco de dados
            const dbPlayer = await Player.findById(player.id);
            if (dbPlayer) {
                const previousLevel = getLevel(dbPlayer.xp);

                dbPlayer.xp += xpEarned;
                dbPlayer.stats.gamesPlayed += 1;
                if (resultType === "WIN" || resultType === "WO") {
                    dbPlayer.stats.wins += 1;
                } else {
                    dbPlayer.stats.losses += 1;
                }
                await dbPlayer.save();

                results.push({
                    playerId: player.id,
                    name: player.name,
                    avatarSeed: player.avatarSeed,
                    score,
                    xpEarned,
                    totalXp: dbPlayer.xp,
                    level: getLevel(dbPlayer.xp),
                    previousLevel,
                    isWinner: player.id === game.winnerId,
                });
            }
        }

        io.to(roomCode).emit(GameEvents.SERVER_GAME_FINISHED, {
            roomCode,
            winnerId: game.winnerId,
            reason: game.endReason,
            results,
        });

        await Room.deleteOne({ code: roomCode });
    } catch (error) {
        console.error("[Game Socket] Error processing game finish:", error);
    }
}

/**
 * Registra os handlers de Game para um socket conectado.
 *
 * Esta camada só cuida da comunicação: recebe a ação, valida o
 * básico (player está em uma sala) e responde no ack. As regras
 * do jogo em si entram na engine.
 *
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
export default function registerGameSocket(io, socket) {
    const player = socket.data.player;

    function requireRoom(callback) {
        const room = getRoom(socket.data.roomCode);

        if (!room) {
            socket.emit(SystemEvents.SERVER_ERROR, {
                code: ErrorCodes.GAME_NOT_FOUND,
                message: "você não está em uma partida",
            });
            callback?.({ success: false });
        }

        return room;
    }

    function emitError(code, message) {
        socket.emit(SystemEvents.SERVER_ERROR, { code, message });
    }

    function checkFinished(game, roomCode) {
        processGameFinishedWithRoomCode(io, game, roomCode);
    }

    socket.on(GameEvents.CLIENT_PLAY_CARD, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        try {
            const game = gameEngine.playCard(room.code, player.id, payload?.cardId, payload?.color);
            broadcastGameState(io, game);
            checkFinished(game, room.code);
            callback?.({ success: true, card: payload?.cardId });
        } catch (error) {
            emitError(ErrorCodes.INVALID_CARD, error.message);
            callback?.({ success: false });
        }
    });

    socket.on(GameEvents.CLIENT_DRAW_CARD, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        try {
            const game = gameEngine.drawCard(room.code, player.id);
            broadcastGameState(io, game);
            callback?.({ success: true });
        } catch (error) {
            emitError(ErrorCodes.NOT_YOUR_TURN, error.message);
            callback?.({ success: false });
        }
    });

    socket.on(GameEvents.CLIENT_PASS_TURN, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        // TODO(game-engine): validar que o player comprou antes de passar.
        callback?.({ success: true });
    });

    socket.on(GameEvents.CLIENT_CHOOSE_COLOR, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        // Color selection is handled in playCard currently.
        callback?.({ success: true, color: payload?.color });
    });

    /**
     * Jogador declara "UNO" ao ficar com 1 carta na mão.
     * Regra: gameEngine.sayUno só aceita se hand.length === 1;
     * caso contrário lança AppError (tratado no catch abaixo).
     */
    socket.on(GameEvents.CLIENT_CALL_UNO, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        try {
            const game = gameEngine.sayUno(room.code, player.id);
            broadcastGameState(io, game);
            callback?.({ success: true });
        } catch (error) {
            emitError(ErrorCodes.INVALID_PAYLOAD, error.message);
            callback?.({ success: false });
        }
    });

    /**
     * Um jogador denuncia outro por não ter dito "UNO" a tempo.
     * payload.targetId = id do jogador denunciado.
     * Se a denúncia for válida (o denunciado não disse UNO e está
     * com 1 carta), ele compra 2 cartas de penalidade.
     */
    socket.on(GameEvents.CLIENT_CATCH_UNO, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        const targetId = payload?.targetId;

        if (!targetId) {
            emitError(ErrorCodes.INVALID_PAYLOAD, "targetId é obrigatório");
            return callback?.({ success: false });
        }

        try {
            const result = gameEngine.challengePlayer(room.code, player.id, targetId);

            io.to(room.code).emit(GameEvents.SERVER_CHALLENGE_RESULT, {
                challengerId: player.id,
                challengedId: targetId,
                success: result.success,
                message: result.message,
            });

            broadcastGameState(io, result.game);
            checkFinished(result.game, room.code);

            callback?.({ success: true, challengeSucceeded: result.success });
        } catch (error) {
            emitError(ErrorCodes.INVALID_PAYLOAD, error.message);
            callback?.({ success: false });
        }
    });

    socket.on(GameEvents.CLIENT_CHALLENGE_DRAW_FOUR, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        // TODO(game-engine): resolver o desafio ao +4 (mecânica diferente do
        // catch-UNO acima: exige verificar se o jogador penalizado tinha uma
        // carta válida da cor anterior na mão no momento da jogada). Ainda não
        // implementado no gameEngine.
        callback?.({ success: true });
    });

    socket.on(GameEvents.CLIENT_READY_NEXT_ROUND, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        // TODO(game-engine): quando todos confirmarem, iniciar a próxima rodada.
        callback?.({ success: true });
    });

    socket.on(GameEvents.CLIENT_REQUEST_REMATCH, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        // TODO(game-engine): reiniciar a sala quando todos aceitarem.
        callback?.({ success: true });
    });
}