const API_URL = "http://localhost:3001";

describe("Cenário 2: Gerenciamento de Salas de Jogo (Lobby)", () => {
    let hostToken = "";
    let player2Token = "";
    let roomCode = "";

    beforeAll(async () => {
        // Criar conta Host
        const resHost = await fetch(`${API_URL}/api/auth/guest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Host Room Test", avatarSeed: "seed1" }),
        });
        const dataHost = await resHost.json();
        hostToken = dataHost.data.token;

        // Criar conta Player 2
        const resPlayer2 = await fetch(`${API_URL}/api/auth/guest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Player2 Room Test", avatarSeed: "seed2" }),
        });
        const dataPlayer2 = await resPlayer2.json();
        player2Token = dataPlayer2.data.token;
    });

    it("Deve criar uma nova sala de jogo com o Host", async () => {
        const response = await fetch(`${API_URL}/api/rooms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${hostToken}`,
            },
            body: JSON.stringify({ maxPlayers: 4, isPrivate: false }),
        });

        expect(response.status).toBe(201);
        const responseData = await response.json();
        expect(responseData.data.room).toBeDefined();
        expect(responseData.data.room.code).toBeDefined();
        
        roomCode = responseData.data.room.code;
    });

    it("Deve permitir a entrada de outro jogador usando o código da sala", async () => {
        const response = await fetch(`${API_URL}/api/rooms/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${player2Token}`,
            },
            body: JSON.stringify({ roomCode }),
        });

        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData.data.room).toBeDefined();
        // Depending on backend logic, currentPlayers might be updated, we check if room is returned
    });

    it("Deve falhar ao tentar entrar com código inválido", async () => {
        const response = await fetch(`${API_URL}/api/rooms/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${player2Token}`,
            },
            body: JSON.stringify({ roomCode: "INVALID_CODE" }),
        });

        expect(response.status).toBe(404);
    });
});
