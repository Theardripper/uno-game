import { jest } from '@jest/globals';

const responseHelperMock = {
    success: jest.fn(),
};

const scoreServiceMock = {
    createScore: jest.fn(),
    getScoreById: jest.fn(),
    updateScore: jest.fn(),
    deleteScore: jest.fn(),
};

jest.unstable_mockModule('#shared/helpers/response.js', () => responseHelperMock);
jest.unstable_mockModule('./score.service.js', () => scoreServiceMock);

const { createScore, getScoreById, updateScore, deleteScore } = await import('./score.controller.js');
const { success } = await import('#shared/helpers/response.js');
const scoreService = await import('./score.service.js');

function mockReq(overrides = {}) {
    return { body: {}, params: {}, ...overrides };
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

// ===================== createScore =====================
describe('ScoreController - createScore', () => {
    it('deve criar a pontuação e responder via helper success (201)', async () => {
        const req = mockReq({ body: { game_id: 111, player: 'p1', points: 50 } });
        const res = mockRes();
        const next = jest.fn();
        const created = { _id: 's1', ...req.body };

        scoreService.createScore.mockResolvedValue(created);

        await createScore(req, res, next);

        expect(scoreService.createScore).toHaveBeenCalledWith(req.body);
        expect(success).toHaveBeenCalledWith(res, created, 'Score created successfully', 201);
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando o service lançar um erro', async () => {
        const req = mockReq({ body: { game_id: 111 } });
        const res = mockRes();
        const next = jest.fn();
        const error = new Error('Falha ao criar');

        scoreService.createScore.mockRejectedValue(error);

        await createScore(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(success).not.toHaveBeenCalled();
    });
});

// ===================== getScoreById =====================
describe('ScoreController - getScoreById', () => {
    it('deve retornar a pontuação encontrada via helper success', async () => {
        const req = mockReq({ params: { id: 's1' } });
        const res = mockRes();
        const next = jest.fn();
        const score = { _id: 's1', points: 50 };

        scoreService.getScoreById.mockResolvedValue(score);

        await getScoreById(req, res, next);

        expect(scoreService.getScoreById).toHaveBeenCalledWith('s1');
        expect(success).toHaveBeenCalledWith(res, score, 'Score fetched successfully');
    });

    it('deve retornar 404 quando a pontuação não for encontrada', async () => {
        const req = mockReq({ params: { id: 'nao-existe' } });
        const res = mockRes();
        const next = jest.fn();

        scoreService.getScoreById.mockResolvedValue(null);

        await getScoreById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Score not found' });
        expect(success).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando o service lançar um erro', async () => {
        const req = mockReq({ params: { id: 's1' } });
        const res = mockRes();
        const next = jest.fn();
        const error = new Error('Falha inesperada');

        scoreService.getScoreById.mockRejectedValue(error);

        await getScoreById(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

// ===================== updateScore =====================
describe('ScoreController - updateScore', () => {
    it('deve atualizar a pontuação e responder via helper success', async () => {
        const req = mockReq({ params: { id: 's1' }, body: { points: 75 } });
        const res = mockRes();
        const next = jest.fn();
        const updated = { _id: 's1', points: 75 };

        scoreService.updateScore.mockResolvedValue(updated);

        await updateScore(req, res, next);

        expect(scoreService.updateScore).toHaveBeenCalledWith('s1', req.body);
        expect(success).toHaveBeenCalledWith(res, updated, 'Score updated successfully');
    });

    it('deve retornar 404 quando a pontuação a ser atualizada não existir', async () => {
        const req = mockReq({ params: { id: 'nao-existe' }, body: { points: 10 } });
        const res = mockRes();
        const next = jest.fn();

        scoreService.updateScore.mockResolvedValue(null);

        await updateScore(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Score not found' });
        expect(success).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando o service lançar um erro', async () => {
        const req = mockReq({ params: { id: 's1' }, body: {} });
        const res = mockRes();
        const next = jest.fn();
        const error = new Error('Falha ao atualizar');

        scoreService.updateScore.mockRejectedValue(error);

        await updateScore(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

// ===================== deleteScore =====================
describe('ScoreController - deleteScore', () => {
    it('deve remover a pontuação e responder via helper success com payload null', async () => {
        const req = mockReq({ params: { id: 's1' } });
        const res = mockRes();
        const next = jest.fn();

        scoreService.deleteScore.mockResolvedValue({ _id: 's1' });

        await deleteScore(req, res, next);

        expect(scoreService.deleteScore).toHaveBeenCalledWith('s1');
        expect(success).toHaveBeenCalledWith(res, null, 'Score removed successfully');
    });

    it('deve retornar 404 quando a pontuação a ser removida não existir', async () => {
        const req = mockReq({ params: { id: 'nao-existe' } });
        const res = mockRes();
        const next = jest.fn();

        scoreService.deleteScore.mockResolvedValue(null);

        await deleteScore(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Score not found' });
        expect(success).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando o service lançar um erro', async () => {
        const req = mockReq({ params: { id: 's1' } });
        const res = mockRes();
        const next = jest.fn();
        const error = new Error('Falha ao remover');

        scoreService.deleteScore.mockRejectedValue(error);

        await deleteScore(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});