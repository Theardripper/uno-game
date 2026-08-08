import { jest } from '@jest/globals';

jest.mock('#shared/helpers/response.js', () => ({
    success: jest.fn(),
}));

jest.mock('./score.service.js', () => ({
    createScore: jest.fn(),
    getScoreById: jest.fn(),
    updateScore: jest.fn(),
    deleteScore: jest.fn(),
}));

import { createScore, getScoreById, updateScore, deleteScore } from './score.controller.js';
import { success } from '#shared/helpers/response.js';
import * as scoreService from './score.service.js';

describe('Score Controller', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            body: {},
            params: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    /* =========================================================================
       5.1. createScore
       ========================================================================= */
    describe('createScore', () => {
        it('deve criar o registro de pontuação com sucesso passando os dados do body e retornar status 201', async () => {
            req.body = {
                player_id: 'p1',
                game_id: 'g1',
                points: 100,
            };
            const mockServiceData = { id: 's1', player_id: 'p1', game_id: 'g1', points: 100 };
            scoreService.createScore.mockResolvedValue(mockServiceData);

            await createScore(req, res, next);

            expect(scoreService.createScore).toHaveBeenCalledWith(req.body);
            expect(success).toHaveBeenCalledWith(res, mockServiceData, 'Score created successfully', 201);
            expect(next).not.toHaveBeenCalled();
        });

        it('deve propagar qualquer erro para o middleware next(error) em caso de falha no serviço ou validação', async () => {
            req.body = {
                player_id: 'p1',
                game_id: 'g1',
                points: 100,
            };
            const mockError = new Error('Erro de validação');
            scoreService.createScore.mockRejectedValue(mockError);

            await createScore(req, res, next);

            expect(scoreService.createScore).toHaveBeenCalledWith(req.body);
            expect(next).toHaveBeenCalledWith(mockError);
            expect(success).not.toHaveBeenCalled();
        });
    });

    /* =========================================================================
       5.2. getScoreById
       ========================================================================= */
    describe('getScoreById', () => {
        it('deve buscar e retornar a pontuação correspondente ao ID informado com status 200', async () => {
            req.params.id = 's1';
            const mockServiceData = { id: 's1', player_id: 'p1', game_id: 'g1', points: 100 };
            scoreService.getScoreById.mockResolvedValue(mockServiceData);

            await getScoreById(req, res, next);

            expect(scoreService.getScoreById).toHaveBeenCalledWith('s1');
            expect(success).toHaveBeenCalledWith(res, mockServiceData, 'Score fetched successfully');
            expect(next).not.toHaveBeenCalled();
        });

        it('deve retornar status 404 caso o scoreService.getScoreById retorne um valor nulo/falso', async () => {
            req.params.id = 'inexistente';
            scoreService.getScoreById.mockResolvedValue(null);

            await getScoreById(req, res, next);

            expect(scoreService.getScoreById).toHaveBeenCalledWith('inexistente');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Score not found' });
            expect(success).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('deve repassar qualquer exceção para o next(error) se o serviço falhar', async () => {
            req.params.id = 's1';
            const mockError = new Error('Erro inesperado');
            scoreService.getScoreById.mockRejectedValue(mockError);

            await getScoreById(req, res, next);

            expect(scoreService.getScoreById).toHaveBeenCalledWith('s1');
            expect(next).toHaveBeenCalledWith(mockError);
            expect(success).not.toHaveBeenCalled();
        });
    });

    /* =========================================================================
       5.3. updateScore
       ========================================================================= */
    describe('updateScore', () => {
        it('deve atualizar a pontuação com sucesso e retornar o status 200 usando o helper success', async () => {
            req.params.id = 's1';
            req.body = { points: 250 };
            const mockServiceData = { id: 's1', player_id: 'p1', game_id: 'g1', points: 250 };
            scoreService.updateScore.mockResolvedValue(mockServiceData);

            await updateScore(req, res, next);

            expect(scoreService.updateScore).toHaveBeenCalledWith('s1', req.body);
            expect(success).toHaveBeenCalledWith(res, mockServiceData, 'Score updated successfully');
            expect(next).not.toHaveBeenCalled();
        });

        it('deve retornar status 404 se o registro a ser atualizado não for localizado pelo serviço', async () => {
            req.params.id = 'inexistente';
            req.body = { points: 250 };
            scoreService.updateScore.mockResolvedValue(null);

            await updateScore(req, res, next);

            expect(scoreService.updateScore).toHaveBeenCalledWith('inexistente', req.body);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Score not found' });
            expect(success).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('deve propagar exceções lançadas pelo serviço utilizando next(error)', async () => {
            req.params.id = 's1';
            req.body = { points: 250 };
            const mockError = new Error('Erro inesperado');
            scoreService.updateScore.mockRejectedValue(mockError);

            await updateScore(req, res, next);

            expect(scoreService.updateScore).toHaveBeenCalledWith('s1', req.body);
            expect(next).toHaveBeenCalledWith(mockError);
            expect(success).not.toHaveBeenCalled();
        });
    });

    /* =========================================================================
       5.4. deleteScore
       ========================================================================= */
    describe('deleteScore', () => {
        it('deve remover a pontuação com sucesso e retornar a resposta do helper success com payload null', async () => {
            req.params.id = 's1';
            const mockServiceData = { id: 's1', player_id: 'p1', game_id: 'g1', points: 100 };
            scoreService.deleteScore.mockResolvedValue(mockServiceData);

            await deleteScore(req, res, next);

            expect(scoreService.deleteScore).toHaveBeenCalledWith('s1');
            expect(success).toHaveBeenCalledWith(res, null, 'Score removed successfully');
            expect(next).not.toHaveBeenCalled();
        });

        it('deve retornar status 404 caso a pontuação a ser deletada não seja encontrada', async () => {
            req.params.id = 'inexistente';
            scoreService.deleteScore.mockResolvedValue(null);

            await deleteScore(req, res, next);

            expect(scoreService.deleteScore).toHaveBeenCalledWith('inexistente');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Score not found' });
            expect(success).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('deve chamar next(error) se houver qualquer exceção durante a execução do serviço', async () => {
            req.params.id = 's1';
            const mockError = new Error('Erro inesperado');
            scoreService.deleteScore.mockRejectedValue(mockError);

            await deleteScore(req, res, next);

            expect(scoreService.deleteScore).toHaveBeenCalledWith('s1');
            expect(next).toHaveBeenCalledWith(mockError);
            expect(success).not.toHaveBeenCalled();
        });
    });
});