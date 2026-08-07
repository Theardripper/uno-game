import { getRoomByCode } from "../room/room.service.js";

export function setupGameGateway(io) {
    io.on("connection", (socket) => {
        console.log('[SOCKET CONNECT]', {
            socketId: socket.id,
            userId: socket.handshake?.auth?.token ? 'HasToken' : 'NoToken', // Adjust as needed since we don't have socket.user yet
        });

        socket.on("room:join", async (payload) => {
            try {
                const { roomCode, playerId } = payload;
                if (!roomCode || !playerId) return;

                // Bind socket to player
                socket.playerId = playerId;
                socket.roomCode = roomCode;

                // Join the socket.io room
                socket.join(roomCode);
                console.log('[ROOM JOIN]', {
                    socketId: socket.id,
                    userId: playerId,
                    roomId: roomCode,
                });

                // Fetch current room state with players populated
                const room = await getRoomByCode(roomCode);

                console.log('[ROOM STATE EMIT]', {
                    roomId: roomCode,
                    players: room.players,
                    playerCount: room.players.length,
                });

                // Broadcast to everyone in the room (including sender)
                io.to(roomCode).emit("room:state-updated", room);
            } catch (error) {
                console.error("Erro no room:join:", error);
            }
        });

        socket.on("game:start", async (payload) => {
            try {
                const { roomCode } = payload;
                // TODO: in Etapa 5, we will actually update the room status to 'in_progress' and init the game
                // For now, we just broadcast that the game started
                io.to(roomCode).emit("game:started", { roomCode });
            } catch (error) {
                console.error("Erro no game:start:", error);
            }
        });

        socket.on("room:leave", async (payload, callback) => {
            try {
                const { roomCode, playerId } = payload;
                if (!roomCode || !playerId) {
                    if (callback) callback({ success: false });
                    return;
                }

                const { leaveRoom } = await import("../room/room.service.js");
                const updatedRoom = await leaveRoom(roomCode, playerId);
                
                socket.leave(roomCode);
                console.log(`Jogador ${playerId} saiu do canal da sala ${roomCode}`);

                if (updatedRoom) {
                    io.to(roomCode).emit("room:state-updated", updatedRoom);
                }
                
                if (callback) callback({ success: true });
            } catch (error) {
                console.error("Erro no room:leave:", error);
                if (callback) callback({ success: false, error: error.message });
            }
        });

        socket.on("disconnect", async () => {
            console.log(`Cliente desconectado: ${socket.id}`);
            
            if (socket.roomCode && socket.playerId) {
                try {
                    const { leaveRoom } = await import("../room/room.service.js");
                    const updatedRoom = await leaveRoom(socket.roomCode, socket.playerId);
                    
                    if (updatedRoom) {
                        io.to(socket.roomCode).emit("room:state-updated", updatedRoom);
                    }
                    console.log(`[DISCONNECT] Jogador ${socket.playerId} removido automaticamente da sala ${socket.roomCode}`);
                } catch (error) {
                    // Ignore errors if the room is already destroyed or player not found
                }
            }
        });
    });
}
