import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as gameController from '../controllers/game.controller.js';
import { extractUser } from '../middlewares/auth.middleware.js';

const router = Router();

// Rotas de Autenticação
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', extractUser, authController.logout);
router.post('/profile', extractUser, authController.getProfile);

// Rotas do Jogo
router.post('/games/create', extractUser, gameController.createGame);
router.post('/games/join', extractUser, gameController.joinGame);
router.post('/games/start', extractUser, gameController.startGame);
router.post('/games/leave', extractUser, gameController.leaveGame);
router.post('/games/end', extractUser, gameController.endGame);
router.post('/games/state', gameController.getGameState);
router.post('/games/hand', extractUser, gameController.getPlayerHand);
router.post('/games/current-player', gameController.getCurrentPlayer);
router.post('/games/top-card', gameController.getTopCard);
router.post('/games/scores', gameController.getScores);

export default router;