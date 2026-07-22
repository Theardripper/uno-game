import { Server } from "socket.io";

const io = new Server(4000, {
    cors: {
        origin: "*",
    },
});

console.log("Mock Server rodando");

io.on("connection", (socket) => {
    // Pega o token que o front enviou no connectSocket(token)
    const token = socket.handshake.auth.token;
    console.log(`Front-end conectou! ID: ${socket.id} | Token: ${token}`);

    // Mock: Finge que atualizou o estado da sala 2 segundos após conectar
    setTimeout(() => {
        console.log("Emitindo para:", socket.id);

        socket.emit(
            "server:room-state",
            {
                teste: true,
            },
            (error) => {
                if (error) console.error("Falha ao entregar:", error);
                else console.log("Entregue com sucesso");
            }
        );

        console.log("Emit enviado");
    }, 2000);

    // Mock: Escuta tudo o que o front-end emitir e apenas loga no terminal
    socket.onAny((eventName, ...args) => {
        console.log(`Recebido do Front [${eventName}]:`, args);
    });

    // Se o front tentar jogar uma carta, a gente devolve uma resposta (acknowledgement)
    socket.on("client:play-card", (payload, callback) => {
        const response = {
            id: "card_1",
            type: "success",
            message: `Carta ${payload.cardId} jogada com sucesso!`,
        };

        callback(response);
    });

    socket.on("disconnect", () => {
        console.log("Front-end desconectou.");
    });
});
