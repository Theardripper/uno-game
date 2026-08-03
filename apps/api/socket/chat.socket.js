import { ErrorCodes } from "../../shared/api/responses/errors.js";
import { ChatEvents, SystemEvents } from "../../shared/socket/events.js";

const MAX_MESSAGE_LENGTH = 200;

/**
 * Registra os handlers de Chat para um socket conectado.
 *
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
export default function registerChatSocket(io, socket) {
    const player = socket.data.player;

    socket.on(ChatEvents.CLIENT_SEND_MESSAGE, (payload, callback) => {
        const roomCode = socket.data.roomCode;
        const message = typeof payload?.message === "string" ? payload.message.trim() : "";

        if (!roomCode) {
            socket.emit(SystemEvents.SERVER_ERROR, {
                code: ErrorCodes.ROOM_NOT_FOUND,
                message: "você não está em uma sala",
            });
            return callback?.({ success: false });
        }

        if (!message || message.length > MAX_MESSAGE_LENGTH) {
            socket.emit(SystemEvents.SERVER_ERROR, {
                code: ErrorCodes.INVALID_PAYLOAD,
                message: "mensagem vazia ou muito longa",
            });
            return callback?.({ success: false });
        }

        io.to(roomCode).emit(ChatEvents.SERVER_CHAT_MESSAGE, {
            playerId: player.id,
            name: player.name,
            message,
            timestamp: new Date().toISOString(),
        });

        callback?.({ success: true });
    });
}
