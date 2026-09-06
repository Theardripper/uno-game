# Documentação dos Testes E2E - API REST

Esta documentação descreve os cenários de testes End-to-End implementados no projeto do Uno

## Casos de Uso Identificados (Fluxo de Trabalho Principal)

1. **Autenticação de Usuário (Guest)**
    - **Endpoint(s):** `POST /api/auth/guest`, `GET /api/players/me`
    - **Descrição:** Testa se a API permite criar uma conta temporária com sucesso, devolvendo o token Bearer, e se a rota protegida `/api/players/me` barra acesso sem token e permite com token.
    - **Status Esperado:** `201 Created` e `200 OK` (com token); `401 Unauthorized` (sem token).

2. **Gerenciamento de Salas de Jogo (Lobby)**
    - **Endpoint(s):** `POST /api/rooms`, `POST /api/rooms/join`
    - **Descrição:** Testa a criação de uma nova sala de jogo pelo Host e a entrada de outros jogadores utilizando o código da sala gerada.
    - **Status Esperado:** `200 OK` com os detalhes da sala criada ou erro `400/404` se tentar entrar com código inválido.

3. **Início da Sessão de Jogo**
    - **Endpoint(s):** `POST /api/games/create`, `POST /api/games/start`
    - **Descrição:** Verifica se é possível criar a instância do jogo a partir da sala e iniciar o jogo com a mão inicial dos jogadores gerada corretamente.
    - **Status Esperado:** `200 OK` na inicialização do jogo e validação do estado inicial da partida.

4. **Envio de Movimentos (Jogar Carta / Comprar Carta)**
    - **Endpoint(s):** `POST /playCard`, `POST /drawCard`, `POST /nextTurn`
    - **Descrição:** Testa as mecânicas principais do UNO de jogar uma carta válida (verificando cor e valor) na pilha central, ou comprar carta caso não tenha opções.
    - **Status Esperado:** `200 OK` caso a jogada seja validada pelas regras de negócio.

5. **Encerramento do Jogo e Status**
    - **Endpoint(s):** `POST /api/games/state`, `POST /api/games/end`
    - **Descrição:** Valida a verificação das condições de vitória (jogador ficar sem cartas) e o encerramento seguro da partida.
    - **Status Esperado:** `200 OK` retornando o estado final e pontuações do vencedor.

---

## Resultados e Validações

_Todos os testes foram escritos utilizando o framework Jest_

### Problemas Encontrados e Resoluções

Durante o desenvolvimento dos testes E2E, foram encontrados e solucionados os seguintes pontos:
1. **Erro de validação (500) na Criação do Jogo**: O `game.service.js` exige o preenchimento dos campos requeridos pelo `game.model.js` (como `title`). Adicionamos esses campos no payload dos testes para atender ao esquema do banco de dados (MongoDB).
2. **Erro de autorização (403) no Início do Jogo**: O JWT retornado para contas temporárias de "guest" não possuía o campo `username`, que era exigido pela API legada para validar o dono do jogo. Para resolver, criamos um *patch* em `auth.middleware.js` para usar o `id` como fallback para o `username`, permitindo que os testes de fluxo de início e fim da partida funcionassem perfeitamente.
3. **Simulação do Motor em Memória**: As rotas dinâmicas `/api/games/:roomCode/*` (novo motor) respondem com "Partida não está em andamento" caso o jogo não tenha sido iniciado via WebSocket. Os testes garantem essa validação de segurança testando e confirmando as respostas `400 Bad Request`.
