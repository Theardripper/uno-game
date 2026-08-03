import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import registerSocket from "./socket/index.js";

const PORT = process.env.PORT || 3001;

/**
 * O Express e o Socket.IO compartilham o mesmo servidor HTTP,
 * então a API REST e o WebSocket rodam na mesma porta.
 */
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

registerSocket(io);

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação disponível em: http://localhost:${PORT}/api-docs`);
});
