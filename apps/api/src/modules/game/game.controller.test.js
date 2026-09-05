import { jest } from '@jest/globals';

// Mocks dos módulos usados pelo controller (ESM nativo -> jest.unstable_mockModule)
const gameServiceMock = {
  createGame: jest.fn(),
  getGameById: jest.fn(),
  updateGame: jest.fn(),
  deleteGame: jest.fn(),
  joinGame: jest.fn(),
  startGame: jest.fn(),
  leaveGame: jest.fn(),
  endGame: jest.fn(),
  getGameState: jest.fn(),
  getGamePlayers: jest.fn(),
  getPlayerHand: jest.fn(),
  getCurrentPlayer: jest.fn(),
  getTopCard: jest.fn(),
  getScores: jest.fn(),
};

const responseHelperMock = {
  success: jest.fn((res, data, message, statusCode = 200) => {
    return res.status(statusCode).json({ message, data });
  }),
};

jest.unstable_mockModule('./game.service.js', () => gameServiceMock);
jest.unstable_mockModule('#shared/helpers/response.js', () => responseHelperMock);

// Import dinâmico DEPOIS de registrar os mocks (obrigatório em ESM)
const gameController = await import('./game.controller.js');

// ---------- Helpers para simular req/res/next do Express ----------
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function mockReq(overrides = {}) {
  return {
    params: {},
    body: {},
    user: { id: 'testuser' },
    ...overrides,
  };
}

const mockNext = () => jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

// ===================== createGame (3 casos) =====================
describe('GameController - createGame', () => {
  it('deve criar o jogo sem name/rules e responder via helper success (201)', async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();
    const next = mockNext();
    const fakeGame = { game_id: 12345, players: ['testuser'] };

    gameServiceMock.createGame.mockResolvedValue(fakeGame);

    await gameController.createGame(req, res, next);

    expect(gameServiceMock.createGame).toHaveBeenCalledWith(req.body, req.user);
    expect(responseHelperMock.success).toHaveBeenCalledWith(res, fakeGame, 'Game created successfully', 201);
    expect(next).not.toHaveBeenCalled();
  });

  it('deve criar o jogo com name/rules e responder diretamente com game_id (201)', async () => {
    const req = mockReq({ body: { name: 'Uno Night', rules: 'classic' } });
    const res = mockRes();
    const next = mockNext();
    const fakeGame = { game_id: 54321 };

    gameServiceMock.createGame.mockResolvedValue(fakeGame);

    await gameController.createGame(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Game created successfully',
      game_id: fakeGame.game_id,
    });
    expect(responseHelperMock.success).not.toHaveBeenCalled();
  });

  it('deve chamar next(error) quando o service lançar um erro', async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('DB failure');

    gameServiceMock.createGame.mockRejectedValue(error);

    await gameController.createGame(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});

// ===================== getGameById (2 casos) =====================
describe('GameController - getGameById', () => {
  it('deve retornar o jogo encontrado via helper success', async () => {
    const req = mockReq({ params: { id: 'abc123' } });
    const res = mockRes();
    const next = mockNext();
    const fakeGame = { _id: 'abc123', game_id: 111 };

    gameServiceMock.getGameById.mockResolvedValue(fakeGame);

    await gameController.getGameById(req, res, next);

    expect(gameServiceMock.getGameById).toHaveBeenCalledWith('abc123');
    expect(responseHelperMock.success).toHaveBeenCalledWith(res, fakeGame, 'Game fetched successfully');
  });

  it('deve chamar next(error) quando o jogo não for encontrado', async () => {
    const req = mockReq({ params: { id: 'nao-existe' } });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('Game not found');

    gameServiceMock.getGameById.mockRejectedValue(error);

    await gameController.getGameById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ===================== updateGame (2 casos) =====================
describe('GameController - updateGame', () => {
  it('deve atualizar o jogo e retornar via helper success', async () => {
    const req = mockReq({ params: { id: 'abc123' }, body: { state: 'paused' } });
    const res = mockRes();
    const next = mockNext();
    const updatedGame = { _id: 'abc123', state: 'paused' };

    gameServiceMock.updateGame.mockResolvedValue(updatedGame);

    await gameController.updateGame(req, res, next);

    expect(gameServiceMock.updateGame).toHaveBeenCalledWith('abc123', req.body);
    expect(responseHelperMock.success).toHaveBeenCalledWith(res, updatedGame, 'Game updated successfully');
  });

  it('deve chamar next(error) se a atualização falhar (jogo inexistente)', async () => {
    const req = mockReq({ params: { id: 'xyz' }, body: {} });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('Game not found');

    gameServiceMock.updateGame.mockRejectedValue(error);

    await gameController.updateGame(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ===================== deleteGame (2 casos) =====================
describe('GameController - deleteGame', () => {
  it('deve remover o jogo e responder com mensagem de sucesso', async () => {
    const req = mockReq({ params: { id: 'abc123' } });
    const res = mockRes();
    const next = mockNext();

    gameServiceMock.deleteGame.mockResolvedValue({ _id: 'abc123' });

    await gameController.deleteGame(req, res, next);

    expect(gameServiceMock.deleteGame).toHaveBeenCalledWith('abc123');
    expect(res.json).toHaveBeenCalledWith({ message: 'Game removed successfully' });
  });

  it('deve chamar next(error) quando o jogo a ser removido não existir', async () => {
    const req = mockReq({ params: { id: 'nao-existe' } });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('Game not found');

    gameServiceMock.deleteGame.mockRejectedValue(error);

    await gameController.deleteGame(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ===================== joinGame (2 casos) =====================
describe('GameController - joinGame', () => {
  it('deve permitir que o usuário entre no jogo (200)', async () => {
    const req = mockReq({ body: { game_id: 111 }, user: { id: 'novoPlayer' } });
    const res = mockRes();
    const next = mockNext();

    gameServiceMock.joinGame.mockResolvedValue({ game_id: 111, players: ['novoPlayer'] });

    await gameController.joinGame(req, res, next);

    expect(gameServiceMock.joinGame).toHaveBeenCalledWith(111, 'novoPlayer');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User joined the game successfully' });
  });

  it('deve chamar next(error) quando o jogo não for encontrado', async () => {
    const req = mockReq({ body: { game_id: 999 } });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('Game not found');

    gameServiceMock.joinGame.mockRejectedValue(error);

    await gameController.joinGame(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ===================== startGame (2 casos) =====================
describe('GameController - startGame', () => {
  it('deve iniciar o jogo quando o usuário for o criador (200)', async () => {
    const req = mockReq({ body: { game_id: 111 }, user: { id: 'criador' } });
    const res = mockRes();
    const next = mockNext();

    gameServiceMock.startGame.mockResolvedValue({ game_id: 111, state: 'in_progress' });

    await gameController.startGame(req, res, next);

    expect(gameServiceMock.startGame).toHaveBeenCalledWith(111, 'criador');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Game started successfully' });
  });

  it('deve chamar next(error) quando alguém que não é o criador tentar iniciar (403)', async () => {
    const req = mockReq({ body: { game_id: 111 }, user: { id: 'intruso' } });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('Only the creator can start the game');

    gameServiceMock.startGame.mockRejectedValue(error);

    await gameController.startGame(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ===================== leaveGame (2 casos) =====================
describe('GameController - leaveGame', () => {
  it('deve permitir que o usuário saia do jogo (200)', async () => {
    const req = mockReq({ body: { game_id: 111 }, user: { id: 'saindo' } });
    const res = mockRes();
    const next = mockNext();

    gameServiceMock.leaveGame.mockResolvedValue({ game_id: 111, players: [] });

    await gameController.leaveGame(req, res, next);

    expect(gameServiceMock.leaveGame).toHaveBeenCalledWith(111, 'saindo');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User left the game successfully' });
  });

  it('deve chamar next(error) quando o jogo não for encontrado', async () => {
    const req = mockReq({ body: { game_id: 999 } });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('Game not found');

    gameServiceMock.leaveGame.mockRejectedValue(error);

    await gameController.leaveGame(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ===================== endGame (2 casos) =====================
describe('GameController - endGame', () => {
  it('deve encerrar o jogo quando o usuário for o criador (200)', async () => {
    const req = mockReq({ body: { game_id: 111 }, user: { id: 'criador' } });
    const res = mockRes();
    const next = mockNext();

    gameServiceMock.endGame.mockResolvedValue({ game_id: 111, state: 'ended' });

    await gameController.endGame(req, res, next);

    expect(gameServiceMock.endGame).toHaveBeenCalledWith(111, 'criador');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Game ended successfully' });
  });

  it('deve chamar next(error) quando alguém que não é o criador tentar encerrar (403)', async () => {
    const req = mockReq({ body: { game_id: 111 }, user: { id: 'intruso' } });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('Only the creator can end the game');

    gameServiceMock.endGame.mockRejectedValue(error);

    await gameController.endGame(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ===================== getGameState (2 casos) =====================
describe('GameController - getGameState', () => {
  it('deve retornar o estado do jogo (200)', async () => {
    const req = mockReq({ body: { game_id: 111 } });
    const res = mockRes();
    const next = mockNext();
    const state = { game_id: 111, state: 'in_progress' };

    gameServiceMock.getGameState.mockResolvedValue(state);

    await gameController.getGameState(req, res, next);

    expect(gameServiceMock.getGameState).toHaveBeenCalledWith(111);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(state);
  });

  it('deve chamar next(error) quando o jogo não for encontrado', async () => {
    const req = mockReq({ body: { game_id: 999 } });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('Game not found');

    gameServiceMock.getGameState.mockRejectedValue(error);

    await gameController.getGameState(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ===================== getGamePlayers (2 casos) =====================
describe('GameController - getGamePlayers', () => {
  it('deve retornar a lista de jogadores (200)', async () => {
    const req = mockReq({ body: { game_id: 111 } });
    const res = mockRes();
    const next = mockNext();
    const players = { game_id: 111, players: ['p1', 'p2'] };

    gameServiceMock.getGamePlayers.mockResolvedValue(players);

    await gameController.getGamePlayers(req, res, next);

    expect(gameServiceMock.getGamePlayers).toHaveBeenCalledWith(111);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(players);
  });

  it('deve chamar next(error) quando o jogo não for encontrado', async () => {
    const req = mockReq({ body: { game_id: 999 } });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('Game not found');

    gameServiceMock.getGamePlayers.mockRejectedValue(error);

    await gameController.getGamePlayers(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ===================== getPlayerHand (2 casos) =====================
describe('GameController - getPlayerHand', () => {
  it('deve retornar a mão do jogador (200)', async () => {
    const req = mockReq({ body: { game_id: 111 } });
    const res = mockRes();
    const next = mockNext();
    const hand = { game_id: 111, hand: ['Red 5', 'Blue Skip', 'Wild Draw Four'] };

    gameServiceMock.getPlayerHand.mockResolvedValue(hand);

    await gameController.getPlayerHand(req, res, next);

    expect(gameServiceMock.getPlayerHand).toHaveBeenCalledWith(111);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(hand);
  });

  it('deve chamar next(error) quando o service lançar um erro', async () => {
    const req = mockReq({ body: { game_id: 111 } });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('Unexpected failure');

    gameServiceMock.getPlayerHand.mockRejectedValue(error);

    await gameController.getPlayerHand(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ===================== getCurrentPlayer (2 casos) =====================
describe('GameController - getCurrentPlayer', () => {
  it('deve retornar o jogador atual (200)', async () => {
    const req = mockReq({ body: { game_id: 111 } });
    const res = mockRes();
    const next = mockNext();
    const currentPlayer = { game_id: 111, current_player: 'p1' };

    gameServiceMock.getCurrentPlayer.mockResolvedValue(currentPlayer);

    await gameController.getCurrentPlayer(req, res, next);

    expect(gameServiceMock.getCurrentPlayer).toHaveBeenCalledWith(111);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(currentPlayer);
  });

  it('deve chamar next(error) quando o jogo não for encontrado', async () => {
    const req = mockReq({ body: { game_id: 999 } });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('Game not found');

    gameServiceMock.getCurrentPlayer.mockRejectedValue(error);

    await gameController.getCurrentPlayer(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ===================== getTopCard (2 casos) =====================
describe('GameController - getTopCard', () => {
  it('deve retornar a carta do topo (200)', async () => {
    const req = mockReq({ body: { game_id: 111 } });
    const res = mockRes();
    const next = mockNext();
    const topCard = { game_id: 111, top_card: 'Ace of Spades' };

    gameServiceMock.getTopCard.mockResolvedValue(topCard);

    await gameController.getTopCard(req, res, next);

    expect(gameServiceMock.getTopCard).toHaveBeenCalledWith(111);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(topCard);
  });

  it('deve chamar next(error) quando o jogo não for encontrado', async () => {
    const req = mockReq({ body: { game_id: 999 } });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('Game not found');

    gameServiceMock.getTopCard.mockRejectedValue(error);

    await gameController.getTopCard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ===================== getScores (2 casos) =====================
describe('GameController - getScores', () => {
  it('deve retornar as pontuações dos jogadores (200)', async () => {
    const req = mockReq({ body: { game_id: 111 } });
    const res = mockRes();
    const next = mockNext();
    const scores = { game_id: 111, scores: { Player1: 100, Player2: 75 } };

    gameServiceMock.getScores.mockResolvedValue(scores);

    await gameController.getScores(req, res, next);

    expect(gameServiceMock.getScores).toHaveBeenCalledWith(111);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(scores);
  });

  it('deve chamar next(error) quando o jogo não for encontrado', async () => {
    const req = mockReq({ body: { game_id: 999 } });
    const res = mockRes();
    const next = mockNext();
    const error = new Error('Game not found');

    gameServiceMock.getScores.mockRejectedValue(error);

    await gameController.getScores(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});