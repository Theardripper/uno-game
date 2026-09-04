import { jest } from '@jest/globals';

// Mock do model Mongoose (Game) e do AppError, usados pelo service
const GameMock = {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOne: jest.fn(),
};

class AppErrorMock extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

jest.unstable_mockModule('./game.model.js', () => ({ default: GameMock }));
jest.unstable_mockModule('#shared/errors/AppError.js', () => ({ AppError: AppErrorMock }));

// Import dinâmico DEPOIS de registrar os mocks (obrigatório em ESM)
const gameService = await import('./game.service.js');

beforeEach(() => {
    jest.clearAllMocks();
});

// ===================== createGame =====================
describe('GameService - createGame', () => {
    it('deve gerar um game_id aleatório quando não informado', async () => {
        const gameData = { name: 'Uno Night' };
        GameMock.create.mockResolvedValue({ game_id: 12345, ...gameData });

        const result = await gameService.createGame(gameData, null);

        expect(GameMock.create).toHaveBeenCalledTimes(1);
        const calledWith = GameMock.create.mock.calls[0][0];
        expect(calledWith.game_id).toEqual(expect.any(Number));
        expect(calledWith.game_id).toBeGreaterThanOrEqual(10000);
        expect(calledWith.game_id).toBeLessThan(100000);
        expect(result.game_id).toBe(12345);
    });

    it('deve usar o username do usuário autenticado como criador e primeiro jogador quando não informado no body', async () => {
        const gameData = { game_id: 111 };
        const user = { id: 'criador' };
        GameMock.create.mockResolvedValue({ game_id: 111, creator_username: 'criador', players: ['criador'] });

        await gameService.createGame(gameData, user);

        const calledWith = GameMock.create.mock.calls[0][0];
        expect(calledWith.creator_username).toBe('criador');
        expect(calledWith.players).toEqual(['criador']);
    });

    it('não deve sobrescrever game_id nem creator_username já informados no body', async () => {
        const gameData = { game_id: 999, creator_username: 'jaDefinido' };
        const user = { username: 'outroUsuario' };
        GameMock.create.mockResolvedValue({ ...gameData });

        await gameService.createGame(gameData, user);

        const calledWith = GameMock.create.mock.calls[0][0];
        expect(calledWith.game_id).toBe(999);
        expect(calledWith.creator_username).toBe('jaDefinido');
        expect(calledWith.players).toBeUndefined();
    });
});

// ===================== getGameById =====================
describe('GameService - getGameById', () => {
    it('deve retornar o jogo quando encontrado', async () => {
        const fakeGame = { _id: 'abc', game_id: 1 };
        GameMock.findById.mockResolvedValue(fakeGame);

        const result = await gameService.getGameById('abc');

        expect(GameMock.findById).toHaveBeenCalledWith('abc');
        expect(result).toBe(fakeGame);
    });

    it('deve lançar AppError 404 quando o jogo não for encontrado', async () => {
        GameMock.findById.mockResolvedValue(null);

        await expect(gameService.getGameById('nao-existe')).rejects.toMatchObject({
            message: 'Game not found',
            statusCode: 404,
        });
    });
});

// ===================== updateGame =====================
describe('GameService - updateGame', () => {
    it('deve atualizar e retornar o jogo quando encontrado', async () => {
        const updated = { _id: 'abc', state: 'paused' };
        GameMock.findByIdAndUpdate.mockResolvedValue(updated);

        const result = await gameService.updateGame('abc', { state: 'paused' });

        expect(GameMock.findByIdAndUpdate).toHaveBeenCalledWith('abc', { state: 'paused' }, { new: true });
        expect(result).toBe(updated);
    });

    it('deve lançar AppError 404 quando o jogo a ser atualizado não existir', async () => {
        GameMock.findByIdAndUpdate.mockResolvedValue(null);

        await expect(gameService.updateGame('nao-existe', {})).rejects.toMatchObject({
            message: 'Game not found',
            statusCode: 404,
        });
    });
});

// ===================== deleteGame =====================
describe('GameService - deleteGame', () => {
    it('deve remover e retornar o jogo quando encontrado', async () => {
        const deleted = { _id: 'abc' };
        GameMock.findByIdAndDelete.mockResolvedValue(deleted);

        const result = await gameService.deleteGame('abc');

        expect(GameMock.findByIdAndDelete).toHaveBeenCalledWith('abc');
        expect(result).toBe(deleted);
    });

    it('deve lançar AppError 404 quando o jogo a ser removido não existir', async () => {
        GameMock.findByIdAndDelete.mockResolvedValue(null);

        await expect(gameService.deleteGame('nao-existe')).rejects.toMatchObject({
            message: 'Game not found',
            statusCode: 404,
        });
    });
});

// ===================== joinGame =====================
describe('GameService - joinGame', () => {
    it('deve adicionar o jogador e inicializar o score quando ele ainda não estiver na partida', async () => {
        const save = jest.fn().mockResolvedValue();
        const fakeGame = { players: ['existente'], scores: undefined, save };
        GameMock.findOne.mockResolvedValue(fakeGame);

        const result = await gameService.joinGame(111, 'novoJogador');

        expect(GameMock.findOne).toHaveBeenCalledWith({ game_id: 111 });
        expect(fakeGame.players).toContain('novoJogador');
        expect(fakeGame.scores.get('novoJogador')).toBe(0);
        expect(save).toHaveBeenCalledTimes(1);
        expect(result).toBe(fakeGame);
    });

    it('não deve duplicar o jogador nem chamar save() se ele já estiver na partida', async () => {
        const save = jest.fn();
        const fakeGame = { players: ['jaEsta'], scores: new Map(), save };
        GameMock.findOne.mockResolvedValue(fakeGame);

        await gameService.joinGame(111, 'jaEsta');

        expect(fakeGame.players).toEqual(['jaEsta']);
        expect(save).not.toHaveBeenCalled();
    });

    it('deve lançar AppError 404 quando o jogo não for encontrado', async () => {
        GameMock.findOne.mockResolvedValue(null);

        await expect(gameService.joinGame(999, 'user')).rejects.toMatchObject({
            message: 'Game not found',
            statusCode: 404,
        });
    });
});

// ===================== startGame =====================
describe('GameService - startGame', () => {
    it('deve iniciar o jogo quando o usuário for o criador', async () => {
        const save = jest.fn().mockResolvedValue();
        const fakeGame = { creator_username: 'criador', players: ['criador', 'p2'], save };
        GameMock.findOne.mockResolvedValue(fakeGame);

        const result = await gameService.startGame(111, 'criador');

        expect(fakeGame.state).toBe('in_progress');
        expect(fakeGame.current_player).toBe('criador');
        expect(save).toHaveBeenCalledTimes(1);
        expect(result).toBe(fakeGame);
    });

    it('deve lançar AppError 403 quando quem tenta iniciar não for o criador', async () => {
        const save = jest.fn();
        // CORREÇÃO AQUI: adicionado o segundo jogador ('p2') para passar da regra de < 2 jogadores
        const fakeGame = { creator_username: 'criador', players: ['criador', 'p2'], save };
        GameMock.findOne.mockResolvedValue(fakeGame);

        await expect(gameService.startGame(111, 'intruso')).rejects.toMatchObject({
            message: 'Only the creator can start the game',
            statusCode: 403,
        });
        expect(save).not.toHaveBeenCalled();
    });

    it('deve lançar AppError 400 se o jogo já estiver encerrado', async () => {
        const save = jest.fn();
        const fakeGame = { state: 'ended', creator_username: 'criador', players: ['criador', 'p2'], save };
        GameMock.findOne.mockResolvedValue(fakeGame);

        await expect(gameService.startGame(111, 'criador')).rejects.toMatchObject({
            message: 'Game has already ended',
            statusCode: 400,
        });
        expect(save).not.toHaveBeenCalled();
    });

    it('deve lançar AppError 400 se houver menos de 2 jogadores', async () => {
        const save = jest.fn();
        const fakeGame = { creator_username: 'criador', players: ['criador'], save };
        GameMock.findOne.mockResolvedValue(fakeGame);

        await expect(gameService.startGame(111, 'criador')).rejects.toMatchObject({
            message: 'At least 2 players are required to start the game',
            statusCode: 400,
        });
        expect(save).not.toHaveBeenCalled();
    });

    it('deve lançar AppError 404 quando o jogo não for encontrado', async () => {
        GameMock.findOne.mockResolvedValue(null);

        await expect(gameService.startGame(999, 'user')).rejects.toMatchObject({
            message: 'Game not found',
            statusCode: 404,
        });
    });
});

// ===================== leaveGame =====================
describe('GameService - leaveGame', () => {
    it('deve remover o jogador da lista de players e do mapa de scores', async () => {
        const save = jest.fn().mockResolvedValue();
        const scores = new Map([['saindo', 10], ['fica', 20]]);
        const fakeGame = { players: ['saindo', 'fica'], scores, save };
        GameMock.findOne.mockResolvedValue(fakeGame);

        const result = await gameService.leaveGame(111, 'saindo');

        expect(fakeGame.players).toEqual(['fica']);
        expect(fakeGame.scores.has('saindo')).toBe(false);
        expect(save).toHaveBeenCalledTimes(1);
        expect(result).toBe(fakeGame);
    });

    it('deve lançar AppError 404 quando o jogo não for encontrado', async () => {
        GameMock.findOne.mockResolvedValue(null);

        await expect(gameService.leaveGame(999, 'user')).rejects.toMatchObject({
            message: 'Game not found',
            statusCode: 404,
        });
    });
});

// ===================== endGame =====================
describe('GameService - endGame', () => {
    it('deve encerrar o jogo quando o usuário for o criador', async () => {
        const save = jest.fn().mockResolvedValue();
        const fakeGame = { creator_username: 'criador', save };
        GameMock.findOne.mockResolvedValue(fakeGame);

        const result = await gameService.endGame(111, 'criador');

        expect(fakeGame.state).toBe('ended');
        expect(save).toHaveBeenCalledTimes(1);
        expect(result).toBe(fakeGame);
    });

    it('deve lançar AppError 403 quando quem tenta encerrar não for o criador', async () => {
        const save = jest.fn();
        const fakeGame = { creator_username: 'criador', save };
        GameMock.findOne.mockResolvedValue(fakeGame);

        await expect(gameService.endGame(111, 'intruso')).rejects.toMatchObject({
            message: 'Only the creator can end the game',
            statusCode: 403,
        });
        expect(save).not.toHaveBeenCalled();
    });
});

// ===================== getGameState =====================
describe('GameService - getGameState', () => {
    it('deve retornar o estado salvo do jogo', async () => {
        GameMock.findOne.mockResolvedValue({ game_id: 111, state: 'ended' });

        const result = await gameService.getGameState(111);

        expect(result).toEqual({ game_id: 111, state: 'ended' });
    });

    it('deve retornar "in_progress" como padrão quando o jogo não tiver state definido', async () => {
        GameMock.findOne.mockResolvedValue({ game_id: 111, state: undefined });

        const result = await gameService.getGameState(111);

        expect(result.state).toBe('in_progress');
    });

    it('deve lançar AppError 404 quando o jogo não for encontrado', async () => {
        GameMock.findOne.mockResolvedValue(null);

        await expect(gameService.getGameState(999)).rejects.toMatchObject({
            message: 'Game not found',
            statusCode: 404,
        });
    });
});

// ===================== getGamePlayers =====================
describe('GameService - getGamePlayers', () => {
    it('deve retornar a lista de jogadores', async () => {
        GameMock.findOne.mockResolvedValue({ game_id: 111, players: ['p1', 'p2'] });

        const result = await gameService.getGamePlayers(111);

        expect(result).toEqual({ game_id: 111, players: ['p1', 'p2'] });
    });

    it('deve lançar AppError 404 quando o jogo não for encontrado', async () => {
        GameMock.findOne.mockResolvedValue(null);

        await expect(gameService.getGamePlayers(999)).rejects.toMatchObject({
            message: 'Game not found',
            statusCode: 404,
        });
    });
});

// ===================== getPlayerHand =====================
describe('GameService - getPlayerHand', () => {
    it('deve retornar uma mão fixa de cartas para o game_id informado', async () => {
        const result = await gameService.getPlayerHand(111);

        expect(result).toEqual({ game_id: 111, hand: ['Red 5', 'Blue Skip', 'Wild Draw Four'] });
    });

    it('não deve consultar o banco de dados (mão é estática, sem persistência)', async () => {
        await gameService.getPlayerHand(111);

        expect(GameMock.findOne).not.toHaveBeenCalled();
    });
});

// ===================== getCurrentPlayer =====================
describe('GameService - getCurrentPlayer', () => {
    it('deve retornar o current_player salvo no jogo', async () => {
        GameMock.findOne.mockResolvedValue({ game_id: 111, current_player: 'p2', players: ['p1', 'p2'] });

        const result = await gameService.getCurrentPlayer(111);

        expect(result).toEqual({ game_id: 111, current_player: 'p2' });
    });

    it('deve usar o primeiro jogador da lista como fallback quando current_player não estiver definido', async () => {
        GameMock.findOne.mockResolvedValue({ game_id: 111, current_player: undefined, players: ['p1'] });

        const result = await gameService.getCurrentPlayer(111);

        expect(result.current_player).toBe('p1');
    });

    it('deve lançar AppError 404 quando o jogo não for encontrado', async () => {
        GameMock.findOne.mockResolvedValue(null);

        await expect(gameService.getCurrentPlayer(999)).rejects.toMatchObject({
            message: 'Game not found',
            statusCode: 404,
        });
    });
});

// ===================== getTopCard =====================
describe('GameService - getTopCard', () => {
    it('deve retornar a carta do topo salva no jogo', async () => {
        GameMock.findOne.mockResolvedValue({ game_id: 111, top_card: 'Wild' });

        const result = await gameService.getTopCard(111);

        expect(result).toEqual({ game_id: 111, top_card: 'Wild' });
    });

    it('deve lançar AppError 404 quando o jogo não for encontrado', async () => {
        GameMock.findOne.mockResolvedValue(null);

        await expect(gameService.getTopCard(999)).rejects.toMatchObject({
            message: 'Game not found',
            statusCode: 404,
        });
    });
});

// ===================== getScores =====================
describe('GameService - getScores', () => {
    it('deve converter o Map de scores em objeto simples', async () => {
        const scores = new Map([['p1', 30], ['p2', 45]]);
        GameMock.findOne.mockResolvedValue({ game_id: 111, scores });

        const result = await gameService.getScores(111);

        expect(result).toEqual({ game_id: 111, scores: { p1: 30, p2: 45 } });
    });

    it('deve lançar AppError 404 quando o jogo não for encontrado', async () => {
        GameMock.findOne.mockResolvedValue(null);

        await expect(gameService.getScores(999)).rejects.toMatchObject({
            message: 'Game not found',
            statusCode: 404,
        });
    });
});