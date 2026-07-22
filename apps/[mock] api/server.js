import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import registerSocket from "./socket/index.js";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

registerSocket(io);

export default server;
