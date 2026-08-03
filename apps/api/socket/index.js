import registerChatSocket from "./chat.socket.js";
import registerGameSocket from "./game.socket.js";
import registerLobbySocket from "./lobby.socket.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

/**
 * Ponto de entrada da camada Socket.IO.
 *
 * - Aplica o middleware de autenticação no handshake.
 * - Registra os handlers de cada domínio para cada conexão.
 *
 * Os nomes dos eventos vêm sempre de apps/shared/socket/events.js,
 * que é o contrato compartilhado com o frontend. Nenhum handler
 * deve usar strings de evento soltas.
 *
 * @param {import('socket.io').Server} io
 */
export default function registerSocket(io) {
    io.use(authMiddleware);

    io.on("connection", (socket) => {
        console.log(`Socket conectado: ${socket.id} (player=${socket.data.player.id})`);

        registerLobbySocket(io, socket);
        registerGameSocket(io, socket);
        registerChatSocket(io, socket);

        socket.on("disconnect", (reason) => {
            console.log(`Socket desconectado: ${socket.id} (${reason})`);
        });
    });
}
