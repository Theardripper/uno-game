const API_URL = "http://localhost:3001";

describe("Cenário 4: Envio de Movimentos (Jogar/Comprar)", () => {
    let playerToken = "";
    const roomCode = "UNO-TEST"; // Simulação de uma sala

    beforeAll(async () => {
        // Criar conta para jogar
        const resPlayer = await fetch(`${API_URL}/api/auth/guest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Player Move Test", avatarSeed: "seed3" }),
        });
        const dataPlayer = await resPlayer.json();
        playerToken = dataPlayer.data.token;
    });

    it("Deve tentar jogar uma carta na mesa", async () => {
        const response = await fetch(`${API_URL}/api/games/${roomCode}/play`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${playerToken}`,
            },
            body: JSON.stringify({ cardId: "card_123", selectedColor: "red" }),
        });

        // Como o jogo não foi inicializado via Socket, o controller do gameEngine retornará erro 400
        // (Isso valida que a rota está protegida e validando o estado do jogo)
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toBeDefined();
        expect(data.error.message).toContain("Partida não está em andamento");
    });

    it("Deve tentar comprar uma carta do deck", async () => {
        const response = await fetch(`${API_URL}/api/games/${roomCode}/draw`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${playerToken}`,
            },
        });

        expect(response.status).toBe(400);
    });

    it("Deve tentar gritar UNO", async () => {
        const response = await fetch(`${API_URL}/api/games/${roomCode}/uno`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${playerToken}`,
            },
        });

        expect(response.status).toBe(400);
    });
});
