import { ErrorCodes } from "../../shared/api/responses/errors.js";
import { GameEvents, SystemEvents } from "../../shared/socket/events.js";

import { getRoom } from "./store/rooms.store.js";

/**
 * Registra os handlers de Game para um socket conectado.
 *
 * Esta camada só cuida da comunicação: recebe a ação, valida o
 * básico (player está em uma sala) e responde no ack. As regras
 * do jogo em si (validar carta, turno, penalidades) entram na US
 * do motor do jogo, que vai plugar aqui.
 *
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
export default function registerGameSocket(io, socket) {
    /**
     * Garante que o player está em uma sala antes de aceitar a ação.
     */
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

    socket.on(GameEvents.CLIENT_PLAY_CARD, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        // TODO(game-engine): validar turno e carta com isPlayableCard,
        // atualizar o estado e emitir SERVER_GAME_STATE para a sala.
        callback?.({ success: true, card: payload?.cardId });
    });

    socket.on(GameEvents.CLIENT_DRAW_CARD, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        // TODO(game-engine): comprar do deck e emitir SERVER_GAME_STATE.
        callback?.({ success: true });
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

        // TODO(game-engine): aplicar a cor escolhida no estado.
        callback?.({ success: true, color: payload?.color });
    });

    socket.on(GameEvents.CLIENT_CALL_UNO, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        // TODO(game-engine): marcar o grito de UNO no estado do player.
        callback?.({ success: true });
    });

    socket.on(GameEvents.CLIENT_CATCH_UNO, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        // TODO(game-engine): aplicar penalidade se a denúncia for válida.
        callback?.({ success: true });
    });

    socket.on(GameEvents.CLIENT_CHALLENGE_DRAW_FOUR, (payload, callback) => {
        const room = requireRoom(callback);
        if (!room) return;

        // TODO(game-engine): resolver o desafio e emitir SERVER_CHALLENGE_RESULT.
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
