const API_URL = "http://localhost:3001";

describe("Cenário 3: Início da Sessão de Jogo", () => {
    let hostToken = "";
    let player2Token = "";
    let gameId = "";

    beforeAll(async () => {
        // Criar conta Host
        const resHost = await fetch(`${API_URL}/api/auth/guest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Host Start Test", avatarSeed: "seed1" }),
        });
        const dataHost = await resHost.json();
        hostToken = dataHost.data.token;

        // Criar conta Player 2
        const resPlayer2 = await fetch(`${API_URL}/api/auth/guest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Player2 Start Test", avatarSeed: "seed2" }),
        });
        const dataPlayer2 = await resPlayer2.json();
        player2Token = dataPlayer2.data.token;
    });

    it("Deve criar uma instância de jogo (Legacy API)", async () => {
        const response = await fetch(`${API_URL}/api/games/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${hostToken}`,
            },
            body: JSON.stringify({ name: "Test Game", title: "Test Game" }),
        });

        // O backend retorna 201
        expect(response.status).toBe(201);
        const responseData = await response.json();
        expect(responseData.game_id).toBeDefined();
        gameId = responseData.game_id;
    });

    it("Deve permitir que o Player 2 entre no jogo", async () => {
        const response = await fetch(`${API_URL}/api/games/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${player2Token}`,
            },
            body: JSON.stringify({ game_id: gameId }),
        });

        expect(response.status).toBe(200);
    });

    it("Deve iniciar a partida com o Host", async () => {
        const response = await fetch(`${API_URL}/api/games/start`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${hostToken}`,
            },
            body: JSON.stringify({ game_id: gameId }),
        });

        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData.message).toBe("Game started successfully");
    });

    it("Deve retornar a mão do jogador", async () => {
        const response = await fetch(`${API_URL}/api/games/hand`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${hostToken}`,
            },
            body: JSON.stringify({ game_id: gameId }),
        });

        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData.hand).toBeDefined();
    });
});
