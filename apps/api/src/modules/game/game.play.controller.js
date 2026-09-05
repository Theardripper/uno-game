import { gameEngine } from './game.engine.js';
import { success } from '#shared/helpers/response.js';
import { AppError } from '#shared/errors/AppError.js';

/**
 * Controller das ações de uma partida em andamento (motor em memória).
 * Todas as rotas são identificadas pelo roomCode e pelo usuário autenticado
 * (req.user.id), nunca por game_id — esse é o domínio do game.service.js.
 */

export const playCard = async (req, res, next) => {
    try {
        const { roomCode } = req.params;
        const { cardId, selectedColor } = req.body;

        const game = gameEngine.playCard(roomCode, req.user.id, cardId, selectedColor);

        return success(res, gameEngine.getPublicGameState(game), 'Card played successfully');
    } catch (error) {
        next(error);
    }
};

export const drawCard = async (req, res, next) => {
    try {
        const { roomCode } = req.params;

        const game = gameEngine.drawCard(roomCode, req.user.id);

        return success(res, gameEngine.getPublicGameState(game), 'Card drawn successfully');
    } catch (error) {
        next(error);
    }
};

export const sayUno = async (req, res, next) => {
    try {
        const { roomCode } = req.params;

        const game = gameEngine.sayUno(roomCode, req.user.id);

        return success(res, gameEngine.getPublicGameState(game), 'UNO declared successfully');
    } catch (error) {
        next(error);
    }
};

export const challengePlayer = async (req, res, next) => {
    try {
        const { roomCode } = req.params;
        const { challengedId } = req.body;

        const result = gameEngine.challengePlayer(roomCode, req.user.id, challengedId);

        return res.status(200).json({
            message: result.message,
            success: result.success,
            state: gameEngine.getPublicGameState(result.game),
        });
    } catch (error) {
        next(error);
    }
};

export const getMyHand = async (req, res, next) => {
    try {
        const { roomCode } = req.params;

        const hand = gameEngine.getPlayerHand(roomCode, req.user.id);

        return success(res, hand, 'Hand fetched successfully');
    } catch (error) {
        next(error);
    }
};

export const getGameHistory = async (req, res, next) => {
    try {
        const { roomCode } = req.params;

        const history = gameEngine.getHistory(roomCode);

        return success(res, history, 'History fetched successfully');
    } catch (error) {
        next(error);
    }
};

export const getLiveScores = async (req, res, next) => {
    try {
        const { roomCode } = req.params;

        const scores = gameEngine.getScores(roomCode);

        return success(res, scores, 'Scores fetched successfully');
    } catch (error) {
        next(error);
    }
};

export const checkHasValidMove = async (req, res, next) => {
    try {
        const { roomCode } = req.params;

        const hasValidMove = gameEngine.hasValidMove(roomCode, req.user.id);

        return success(res, { roomCode, hasValidMove }, 'Move check completed successfully');
    } catch (error) {
        next(error);
    }
};

export const getGameStatus = async (req, res, next) => {
    try {
        const { roomCode } = req.params;

        const game = gameEngine.getGame(roomCode);
        if (!game) throw new AppError('Partida não encontrada', 404);

        return success(res, gameEngine.getPublicGameState(game), 'Game status fetched successfully');
    } catch (error) {
        next(error);
    }
};