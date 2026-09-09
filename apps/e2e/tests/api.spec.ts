const API_URL = "http://localhost:3001";

describe("Cenário 1: Autenticação de Usuário (Guest)", () => {
    let token = "";

    it("Deve falhar ao tentar acessar o perfil (rota que é protegida) sem estar autenticado", async () => {
        const response = await fetch(`${API_URL}/api/players/me`);

        // Verifica se a API bloqueia o acesso e retorna Não Autorizado (401)
        expect(response.status).toBe(401);
    });

    it("Deve criar uma conta Guest com sucesso e retornar o token", async () => {
        // Envia requisição POST para a rota de criar guest
        const response = await fetch(`${API_URL}/api/auth/guest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "Jogador Teste",
                avatarSeed: "seed123",
            }),
        });

        // O controller do Auth retorna 201 Created p/ novas contas
        expect(response.status).toBe(201);

        const responseData = await response.json();

        // Verifica se a resposta contém a estrutura correta
        expect(responseData.data).toBeDefined();
        expect(responseData.data).toHaveProperty("token");
        expect(responseData.data).toHaveProperty("player");
        expect(responseData.data.player.name).toBe("Jogador Teste");

        // Salva o token para ser usado no próximo teste
        token = responseData.data.token;
    });

    it("Deve conseguir acessar o perfil usando o token recebido", async () => {
        // Agora fazemos a mesma requisição do 1o teste, mas enviando o token
        const response = await fetch(`${API_URL}/api/players/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.status).toBe(200);

        const responseData = await response.json();
        expect(responseData.data).toBeDefined();
        expect(responseData.data.player.name).toBe("Jogador Teste");
    });
});
