import { jest } from '@jest/globals';

const ScoreMock = {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
};

jest.unstable_mockModule('./score.model.js', () => ({ default: ScoreMock }));

const scoreService = await import('./score.service.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('ScoreService - createScore', () => {
    it('deve criar a pontuação repassando os dados recebidos para o model', async () => {
        const data = { game_id: 111, player: 'p1', points: 50 };
        const created = { _id: 's1', ...data };
        ScoreMock.create.mockResolvedValue(created);

        const result = await scoreService.createScore(data);

        expect(ScoreMock.create).toHaveBeenCalledWith(data);
        expect(result).toBe(created);
    });
});

describe('ScoreService - getScoreById', () => {
    it('deve retornar a pontuação encontrada pelo id', async () => {
        const score = { _id: 's1', points: 50 };
        ScoreMock.findById.mockResolvedValue(score);

        const result = await scoreService.getScoreById('s1');

        expect(ScoreMock.findById).toHaveBeenCalledWith('s1');
        expect(result).toBe(score);
    });

    it('deve retornar null quando a pontuação não for encontrada', async () => {
        ScoreMock.findById.mockResolvedValue(null);

        const result = await scoreService.getScoreById('nao-existe');

        expect(result).toBeNull();
    });
});

describe('ScoreService - updateScore', () => {
    it('deve atualizar a pontuação e retornar o documento atualizado', async () => {
        const updated = { _id: 's1', points: 75 };
        ScoreMock.findByIdAndUpdate.mockResolvedValue(updated);

        const result = await scoreService.updateScore('s1', { points: 75 });

        expect(ScoreMock.findByIdAndUpdate).toHaveBeenCalledWith('s1', { points: 75 }, { new: true });
        expect(result).toBe(updated);
    });

    it('deve retornar null quando a pontuação a ser atualizada não existir', async () => {
        ScoreMock.findByIdAndUpdate.mockResolvedValue(null);

        const result = await scoreService.updateScore('nao-existe', { points: 10 });

        expect(result).toBeNull();
    });
});

describe('ScoreService - deleteScore', () => {
    it('deve remover a pontuação e retornar o documento removido', async () => {
        const deleted = { _id: 's1' };
        ScoreMock.findByIdAndDelete.mockResolvedValue(deleted);

        const result = await scoreService.deleteScore('s1');

        expect(ScoreMock.findByIdAndDelete).toHaveBeenCalledWith('s1');
        expect(result).toBe(deleted);
    });

    it('deve retornar null quando a pontuação a ser removida não existir', async () => {
        ScoreMock.findByIdAndDelete.mockResolvedValue(null);

        const result = await scoreService.deleteScore('nao-existe');

        expect(result).toBeNull();
    });
});