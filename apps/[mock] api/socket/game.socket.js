import { SocketEvents } from "../../shared/socket/events.js";

export default function registerGameSocket(socket) {
    socket.on(
        SocketEvents.CLIENT_PLAY_CARD,

        (payload, callback) => {
            callback({
                success: true,

                card: payload.cardId,
            });
        }
    );
}
