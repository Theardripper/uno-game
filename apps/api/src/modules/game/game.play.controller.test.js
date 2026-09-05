import { jest } from '@jest/globals';

const gameEngineMock = {
    playCard: jest.fn(),
    drawCard: jest.fn(),
    sayUno: jest.fn(),
    challengePlayer: jest.fn(),
    getPlayerHand: jest.fn(),
    getHistory: jest.fn(),
    getScores: jest.fn(),
    getGame: jest.fn(),
    getPublicGameState: jest.fn(),
    hasValidMove: jest.fn(),
};

const responseHelperMock = {
    success: jest.fn(),
};

class AppErrorMock extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

jest.unstable_mockModule('./game.engine.js', () => ({ gameEngine: gameEngineMock }));
jest.unstable_mockModule('#shared/helpers/response.js', () => responseHelperMock);
jest.unstable_mockModule('#shared/errors/AppError.js', () => ({ AppError: AppErrorMock }));

const {
    playCard,
    drawCard,
    sayUno,
    challengePlayer,
    getMyHand,
    getGameHistory,
    getLiveScores,
    getGameStatus,
    checkHasValidMove,
} = await import('./game.play.controller.js');
const { success } = await import('#shared/helpers/response.js');

function mockReq(overrides = {}) {
    return { params: { roomCode: 'UNO-AB12' }, body: {}, user: { id: 'p1' }, ...overrides };
}

function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

beforeEach(() => {
    jest.clearAllMocks();
});

// ===================== playCard =====================
describe('GamePlayController - playCard', () => {
    it('deve jogar a carta e responder com o estado público via helper success', async () => {
        const req = mockReq({ body: { cardId: 'c1', selectedColor: 'red' } });
        const res = mockRes();
        const next = jest.fn();
        const game = { roomCode: 'UNO-AB12' };
        const publicState = { roomCode: 'UNO-AB12', status: 'in_progress' };

        gameEngineMock.playCard.mockReturnValue(game);
        gameEngineMock.getPublicGameState.mockReturnValue(publicState);

        await playCard(req, res, next);

        expect(gameEngineMock.playCard).toHaveBeenCalledWith('UNO-AB12', 'p1', 'c1', 'red');
        expect(success).toHaveBeenCalledWith(res, publicState, 'Card played successfully');
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando a jogada for inválida', async () => {
        const req = mockReq({ body: { cardId: 'invalida' } });
        const res = mockRes();
        const next = jest.fn();
        const error = new AppErrorMock('Jogada inválida! A carta não combina com a cor ou valor atual.', 400);

        gameEngineMock.playCard.mockImplementation(() => {
            throw error;
        });

        await playCard(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(success).not.toHaveBeenCalled();
    });
});

// ===================== drawCard =====================
describe('GamePlayController - drawCard', () => {
    it('deve comprar a carta e responder com o estado público via helper success', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();
        const game = { roomCode: 'UNO-AB12' };
        const publicState = { roomCode: 'UNO-AB12' };

        gameEngineMock.drawCard.mockReturnValue(game);
        gameEngineMock.getPublicGameState.mockReturnValue(publicState);

        await drawCard(req, res, next);

        expect(gameEngineMock.drawCard).toHaveBeenCalledWith('UNO-AB12', 'p1');
        expect(success).toHaveBeenCalledWith(res, publicState, 'Card drawn successfully');
    });

    it('deve chamar next(error) quando não for o turno do jogador', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();
        const error = new AppErrorMock('Não é o seu turno', 400);

        gameEngineMock.drawCard.mockImplementation(() => {
            throw error;
        });

        await drawCard(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

// ===================== sayUno =====================
describe('GamePlayController - sayUno', () => {
    it('deve declarar UNO e responder com o estado público via helper success', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();
        const game = { roomCode: 'UNO-AB12' };
        const publicState = { roomCode: 'UNO-AB12' };

        gameEngineMock.sayUno.mockReturnValue(game);
        gameEngineMock.getPublicGameState.mockReturnValue(publicState);

        await sayUno(req, res, next);

        expect(gameEngineMock.sayUno).toHaveBeenCalledWith('UNO-AB12', 'p1');
        expect(success).toHaveBeenCalledWith(res, publicState, 'UNO declared successfully');
    });

    it('deve chamar next(error) quando o jogador não tiver exatamente 1 carta', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();
        const error = new AppErrorMock('Só é possível dizer UNO quando você tem exatamente 1 carta na mão', 400);

        gameEngineMock.sayUno.mockImplementation(() => {
            throw error;
        });

        await sayUno(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

// ===================== challengePlayer =====================
describe('GamePlayController - challengePlayer', () => {
    it('deve responder 200 com o resultado do desafio bem-sucedido', async () => {
        const req = mockReq({ body: { challengedId: 'p2' } });
        const res = mockRes();
        const next = jest.fn();
        const game = { roomCode: 'UNO-AB12' };
        const publicState = { roomCode: 'UNO-AB12' };

        gameEngineMock.challengePlayer.mockReturnValue({ game, success: true, message: 'p2 esqueceu de dizer UNO.' });
        gameEngineMock.getPublicGameState.mockReturnValue(publicState);

        await challengePlayer(req, res, next);

        expect(gameEngineMock.challengePlayer).toHaveBeenCalledWith('UNO-AB12', 'p1', 'p2');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'p2 esqueceu de dizer UNO.',
            success: true,
            state: publicState,
        });
    });

    it('deve responder 200 com success:false quando o desafio falhar', async () => {
        const req = mockReq({ body: { challengedId: 'p2' } });
        const res = mockRes();
        const next = jest.fn();
        const game = { roomCode: 'UNO-AB12' };

        gameEngineMock.challengePlayer.mockReturnValue({ game, success: false, message: 'p2 disse UNO a tempo.' });
        gameEngineMock.getPublicGameState.mockReturnValue({});

        await challengePlayer(req, res, next);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'p2 disse UNO a tempo.' }));
    });

    it('deve chamar next(error) quando o jogador desafiado não tiver 1 carta', async () => {
        const req = mockReq({ body: { challengedId: 'p2' } });
        const res = mockRes();
        const next = jest.fn();
        const error = new AppErrorMock('Não é possível desafiar: o jogador não está com uma única carta', 400);

        gameEngineMock.challengePlayer.mockImplementation(() => {
            throw error;
        });

        await challengePlayer(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

// ===================== getMyHand =====================
describe('GamePlayController - getMyHand', () => {
    it('deve retornar a mão do jogador autenticado via helper success', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();
        const hand = { roomCode: 'UNO-AB12', playerId: 'p1', hand: [{ id: 'c1', color: 'red', value: '5' }] };

        gameEngineMock.getPlayerHand.mockReturnValue(hand);

        await getMyHand(req, res, next);

        expect(gameEngineMock.getPlayerHand).toHaveBeenCalledWith('UNO-AB12', 'p1');
        expect(success).toHaveBeenCalledWith(res, hand, 'Hand fetched successfully');
    });

    it('deve chamar next(error) quando a partida não existir', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();
        const error = new AppErrorMock('Partida não encontrada', 404);

        gameEngineMock.getPlayerHand.mockImplementation(() => {
            throw error;
        });

        await getMyHand(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

// ===================== getGameHistory =====================
describe('GamePlayController - getGameHistory', () => {
    it('deve retornar o histórico da partida via helper success', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();
        const history = { roomCode: 'UNO-AB12', history: [{ player: 'p1', action: 'drew_card' }] };

        gameEngineMock.getHistory.mockReturnValue(history);

        await getGameHistory(req, res, next);

        expect(gameEngineMock.getHistory).toHaveBeenCalledWith('UNO-AB12');
        expect(success).toHaveBeenCalledWith(res, history, 'History fetched successfully');
    });

    it('deve chamar next(error) quando a partida não existir', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();
        const error = new AppErrorMock('Partida não encontrada', 404);

        gameEngineMock.getHistory.mockImplementation(() => {
            throw error;
        });

        await getGameHistory(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

// ===================== getLiveScores =====================
describe('GamePlayController - getLiveScores', () => {
    it('deve retornar o placar corrente da partida via helper success', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();
        const scores = { roomCode: 'UNO-AB12', scores: { p1: 5, p2: 20 } };

        gameEngineMock.getScores.mockReturnValue(scores);

        await getLiveScores(req, res, next);

        expect(gameEngineMock.getScores).toHaveBeenCalledWith('UNO-AB12');
        expect(success).toHaveBeenCalledWith(res, scores, 'Scores fetched successfully');
    });

    it('deve chamar next(error) quando a partida não existir', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();
        const error = new AppErrorMock('Partida não encontrada', 404);

        gameEngineMock.getScores.mockImplementation(() => {
            throw error;
        });

        await getLiveScores(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

// ===================== checkHasValidMove =====================
describe('GamePlayController - checkHasValidMove', () => {
    it('deve retornar hasValidMove:true via helper success', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();

        gameEngineMock.hasValidMove.mockReturnValue(true);

        await checkHasValidMove(req, res, next);

        expect(gameEngineMock.hasValidMove).toHaveBeenCalledWith('UNO-AB12', 'p1');
        expect(success).toHaveBeenCalledWith(res, { roomCode: 'UNO-AB12', hasValidMove: true }, 'Move check completed successfully');
    });

    it('deve chamar next(error) quando a partida não existir', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();
        const error = new AppErrorMock('Partida não está em andamento', 400);

        gameEngineMock.hasValidMove.mockImplementation(() => {
            throw error;
        });

        await checkHasValidMove(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

// ===================== getGameStatus =====================
describe('GamePlayController - getGameStatus', () => {
    it('deve retornar o estado público da partida via helper success', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();
        const game = { roomCode: 'UNO-AB12' };
        const publicState = { roomCode: 'UNO-AB12', status: 'in_progress' };

        gameEngineMock.getGame.mockReturnValue(game);
        gameEngineMock.getPublicGameState.mockReturnValue(publicState);

        await getGameStatus(req, res, next);

        expect(gameEngineMock.getGame).toHaveBeenCalledWith('UNO-AB12');
        expect(success).toHaveBeenCalledWith(res, publicState, 'Game status fetched successfully');
    });

    it('deve chamar next(error) com AppError 404 quando a partida não existir no motor', async () => {
        const req = mockReq();
        const res = mockRes();
        const next = jest.fn();

        gameEngineMock.getGame.mockReturnValue(undefined);

        await getGameStatus(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Partida não encontrada', statusCode: 404 }));
        expect(success).not.toHaveBeenCalled();
    });
});