import { jest } from '@jest/globals';

jest.mock('#shared/helpers/response.js', () => ({
    success: jest.fn(),
}));

jest.mock('./player.service.js', () => ({
    createPlayer: jest.fn(),
    getPlayerById: jest.fn(),
    updatePlayer: jest.fn(),
    deletePlayer: jest.fn(),
}));

import {
    createPlayer,
    getMe,
    updateMe,
    getStats,
    getHistory,
    getPlayerById,
    updatePlayer,
    deletePlayer,
} from './player.controller.js';
import { success } from '#shared/helpers/response.js';
import * as playerService from './player.service.js';

describe('Player Controller', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            body: {},
            params: {},
            user: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    /* =========================================================================
       createPlayer
       ========================================================================= */
    describe('createPlayer', () => {
        it('deve criar o jogador com sucesso passando os dados do body e retornar status 201', async () => {
            req.body = { name: 'John Doe', email: 'john@example.com' };
            const mockServiceData = { id: 'p1', name: 'John Doe', email: 'john@example.com' };
            playerService.createPlayer.mockResolvedValue(mockServiceData);

            await createPlayer(req, res, next);

            expect(playerService.createPlayer).toHaveBeenCalledWith(req.body);
            expect(success).toHaveBeenCalledWith(res, mockServiceData, 'Player created successfully', 201);
            expect(next).not.toHaveBeenCalled();
        });

        it('deve propagar qualquer erro para o middleware next(error) em caso de falha no serviço', async () => {
            req.body = { name: 'John Doe', email: 'john@example.com' };
            const mockError = new Error('Erro de validação');
            playerService.createPlayer.mockRejectedValue(mockError);

            await createPlayer(req, res, next);

            expect(playerService.createPlayer).toHaveBeenCalledWith(req.body);
            expect(next).toHaveBeenCalledWith(mockError);
            expect(success).not.toHaveBeenCalled();
        });
    });

    /* =========================================================================
       getMe
       ========================================================================= */
    describe('getMe', () => {
        it('deve buscar e retornar o jogador autenticado com status 200', async () => {
            req.user.id = 'p1';
            const mockPlayer = { id: 'p1', name: 'John Doe', toPublicJSON: jest.fn().mockReturnValue({ id: 'p1', name: 'John Doe' }) };
            playerService.getPlayerById.mockResolvedValue(mockPlayer);

            await getMe(req, res, next);

            expect(playerService.getPlayerById).toHaveBeenCalledWith('p1');
            expect(mockPlayer.toPublicJSON).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith(res, { player: { id: 'p1', name: 'John Doe' } }, 'Current player fetched successfully');
            expect(next).not.toHaveBeenCalled();
        });

        it('deve retornar status 404 caso o playerService.getPlayerById retorne um valor nulo/falso', async () => {
            req.user.id = 'inexistente';
            playerService.getPlayerById.mockResolvedValue(null);

            await getMe(req, res, next);

            expect(playerService.getPlayerById).toHaveBeenCalledWith('inexistente');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Player not found' });
            expect(success).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('deve repassar qualquer exceção para o next(error) se o serviço falhar', async () => {
            req.user.id = 'p1';
            const mockError = new Error('Erro inesperado');
            playerService.getPlayerById.mockRejectedValue(mockError);

            await getMe(req, res, next);

            expect(playerService.getPlayerById).toHaveBeenCalledWith('p1');
            expect(next).toHaveBeenCalledWith(mockError);
            expect(success).not.toHaveBeenCalled();
        });
    });

    /* =========================================================================
       updateMe
       ========================================================================= */
    describe('updateMe', () => {
        it('deve atualizar o jogador autenticado com sucesso e retornar status 200', async () => {
            req.user.id = 'p1';
            req.body = { name: 'John Updated' };
            const mockPlayer = { id: 'p1', name: 'John Updated', toPublicJSON: jest.fn().mockReturnValue({ id: 'p1', name: 'John Updated' }) };
            playerService.updatePlayer.mockResolvedValue(mockPlayer);

            await updateMe(req, res, next);

            expect(playerService.updatePlayer).toHaveBeenCalledWith('p1', req.body);
            expect(mockPlayer.toPublicJSON).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith(res, { player: { id: 'p1', name: 'John Updated' } }, 'Player updated successfully');
            expect(next).not.toHaveBeenCalled();
        });

        it('deve retornar status 404 se o jogador autenticado não for localizado pelo serviço', async () => {
            req.user.id = 'inexistente';
            req.body = { name: 'John Updated' };
            playerService.updatePlayer.mockResolvedValue(null);

            await updateMe(req, res, next);

            expect(playerService.updatePlayer).toHaveBeenCalledWith('inexistente', req.body);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Player not found' });
            expect(success).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('deve propagar exceções lançadas pelo serviço utilizando next(error)', async () => {
            req.user.id = 'p1';
            req.body = { name: 'John Updated' };
            const mockError = new Error('Erro inesperado');
            playerService.updatePlayer.mockRejectedValue(mockError);

            await updateMe(req, res, next);

            expect(playerService.updatePlayer).toHaveBeenCalledWith('p1', req.body);
            expect(next).toHaveBeenCalledWith(mockError);
            expect(success).not.toHaveBeenCalled();
        });
    });

    /* =========================================================================
       getStats
       ========================================================================= */
    describe('getStats', () => {
        it('deve retornar as estatísticas fixas do jogador com status 200 via helper success', async () => {
            const expectedStats = {
                totalMatches: 42,
                wins: 15,
                winRate: 35.7,
                totalCardsPlayed: 1450,
                totalCardsDrawn: 890,
                timesShoutedUno: 22,
            };

            await getStats(req, res, next);

            expect(success).toHaveBeenCalledWith(res, { stats: expectedStats }, 'Player stats fetched successfully');
            expect(next).not.toHaveBeenCalled();
        });

        it('deve chamar next(error) caso ocorra uma exceção inesperada', async () => {
            const mockError = new Error('Erro inesperado');
            success.mockImplementationOnce(() => {
                throw mockError;
            });

            await getStats(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    /* =========================================================================
       getHistory
       ========================================================================= */
    describe('getHistory', () => {
        it('deve retornar o histórico vazio do jogador com status 200 via helper success', async () => {
            await getHistory(req, res, next);

            expect(success).toHaveBeenCalledWith(res, { history: [] }, 'Player history fetched successfully');
            expect(next).not.toHaveBeenCalled();
        });

        it('deve chamar next(error) caso ocorra uma exceção inesperada', async () => {
            const mockError = new Error('Erro inesperado');
            success.mockImplementationOnce(() => {
                throw mockError;
            });

            await getHistory(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    /* =========================================================================
       getPlayerById
       ========================================================================= */
    describe('getPlayerById', () => {
        it('deve buscar e retornar o jogador correspondente ao ID informado com status 200', async () => {
            req.params.id = 'p1';
            const mockPlayer = { id: 'p1', name: 'John Doe', toPublicJSON: jest.fn().mockReturnValue({ id: 'p1', name: 'John Doe' }) };
            playerService.getPlayerById.mockResolvedValue(mockPlayer);

            await getPlayerById(req, res, next);

            expect(playerService.getPlayerById).toHaveBeenCalledWith('p1');
            expect(mockPlayer.toPublicJSON).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith(res, { player: { id: 'p1', name: 'John Doe' } }, 'Player fetched successfully');
            expect(next).not.toHaveBeenCalled();
        });

        it('deve retornar status 404 caso o playerService.getPlayerById retorne um valor nulo/falso', async () => {
            req.params.id = 'inexistente';
            playerService.getPlayerById.mockResolvedValue(null);

            await getPlayerById(req, res, next);

            expect(playerService.getPlayerById).toHaveBeenCalledWith('inexistente');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Player not found' });
            expect(success).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('deve repassar qualquer exceção para o next(error) se o serviço falhar', async () => {
            req.params.id = 'p1';
            const mockError = new Error('Erro inesperado');
            playerService.getPlayerById.mockRejectedValue(mockError);

            await getPlayerById(req, res, next);

            expect(playerService.getPlayerById).toHaveBeenCalledWith('p1');
            expect(next).toHaveBeenCalledWith(mockError);
            expect(success).not.toHaveBeenCalled();
        });
    });

    /* =========================================================================
       updatePlayer
       ========================================================================= */
    describe('updatePlayer', () => {
        it('deve atualizar o jogador com sucesso e retornar o status 200 usando o helper success', async () => {
            req.params.id = 'p1';
            req.body = { name: 'John Updated' };
            const mockServiceData = { id: 'p1', name: 'John Updated' };
            playerService.updatePlayer.mockResolvedValue(mockServiceData);

            await updatePlayer(req, res, next);

            expect(playerService.updatePlayer).toHaveBeenCalledWith('p1', req.body);
            expect(success).toHaveBeenCalledWith(res, mockServiceData, 'Player updated successfully');
            expect(next).not.toHaveBeenCalled();
        });

        it('deve retornar status 404 se o registro a ser atualizado não for localizado pelo serviço', async () => {
            req.params.id = 'inexistente';
            req.body = { name: 'John Updated' };
            playerService.updatePlayer.mockResolvedValue(null);

            await updatePlayer(req, res, next);

            expect(playerService.updatePlayer).toHaveBeenCalledWith('inexistente', req.body);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Player not found' });
            expect(success).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('deve propagar exceções lançadas pelo serviço utilizando next(error)', async () => {
            req.params.id = 'p1';
            req.body = { name: 'John Updated' };
            const mockError = new Error('Erro inesperado');
            playerService.updatePlayer.mockRejectedValue(mockError);

            await updatePlayer(req, res, next);

            expect(playerService.updatePlayer).toHaveBeenCalledWith('p1', req.body);
            expect(next).toHaveBeenCalledWith(mockError);
            expect(success).not.toHaveBeenCalled();
        });
    });

    /* =========================================================================
       deletePlayer
       ========================================================================= */
    describe('deletePlayer', () => {
        it('deve remover o jogador com sucesso e retornar a resposta do helper success com payload null', async () => {
            req.params.id = 'p1';
            const mockServiceData = { id: 'p1', name: 'John Doe' };
            playerService.deletePlayer.mockResolvedValue(mockServiceData);

            await deletePlayer(req, res, next);

            expect(playerService.deletePlayer).toHaveBeenCalledWith('p1');
            expect(success).toHaveBeenCalledWith(res, null, 'Player removed successfully');
            expect(next).not.toHaveBeenCalled();
        });

        it('deve retornar status 404 caso o jogador a ser deletado não seja encontrado', async () => {
            req.params.id = 'inexistente';
            playerService.deletePlayer.mockResolvedValue(null);

            await deletePlayer(req, res, next);

            expect(playerService.deletePlayer).toHaveBeenCalledWith('inexistente');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Player not found' });
            expect(success).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('deve chamar next(error) se houver qualquer exceção durante a execução do serviço', async () => {
            req.params.id = 'p1';
            const mockError = new Error('Erro inesperado');
            playerService.deletePlayer.mockRejectedValue(mockError);

            await deletePlayer(req, res, next);

            expect(playerService.deletePlayer).toHaveBeenCalledWith('p1');
            expect(next).toHaveBeenCalledWith(mockError);
            expect(success).not.toHaveBeenCalled();
        });
    });
});