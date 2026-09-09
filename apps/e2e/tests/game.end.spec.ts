const API_URL = "http://localhost:3001";

describe("Cenário 5: Encerramento do Jogo e Status", () => {
    let hostToken = "";
    let gameId = "";

    beforeAll(async () => {
        // Criar conta Host
        const resHost = await fetch(`${API_URL}/api/auth/guest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Host End Test", avatarSeed: "seed1" }),
        });
        const dataHost = await resHost.json();
        hostToken = dataHost.data.token;

        // Cria o jogo
        const resGame = await fetch(`${API_URL}/api/games/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${hostToken}`,
            },
            body: JSON.stringify({ name: "Game to End", title: "Test Game" }),
        });
        const dataGame = await resGame.json();
        gameId = dataGame.game_id;
    });

    it("Deve encerrar o jogo corretamente", async () => {
        const response = await fetch(`${API_URL}/api/games/end`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${hostToken}`,
            },
            body: JSON.stringify({ game_id: gameId }),
        });

        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData.message).toBe("Game ended successfully");
    });

    it("Deve retornar o status atualizado da partida", async () => {
        const response = await fetch(`${API_URL}/api/games/state`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ game_id: gameId }),
        });

        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData.state).toBe("ended");
    });
});
