import registerGameSocket from "./game.socket.js";
import registerLobbySocket from "./lobby.socket.js";

export default function registerSocket(io) {
    io.on("connection", (socket) => {
        console.log(`Socket conectado: ${socket.id}`);

        registerLobbySocket(socket);

        registerGameSocket(socket);
    });
}
