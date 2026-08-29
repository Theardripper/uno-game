import { Router } from 'express';
import * as gameController from './game.controller.js';
import { extractUser } from '#middlewares/auth.middleware.js';

const router = Router();

router.post('/create', extractUser, gameController.createGame);
router.post('/join', extractUser, gameController.joinGame);
router.post('/start', extractUser, gameController.startGame);
router.post('/leave', extractUser, gameController.leaveGame);
router.post('/end', extractUser, gameController.endGame);
router.post('/state', gameController.getGameState);
router.post('/hand', extractUser, gameController.getPlayerHand);
router.post('/current-player', gameController.getCurrentPlayer);
router.post('/top-card', gameController.getTopCard);
router.post('/scores', gameController.getScores);
router.post('/players', gameController.getGamePlayers);


// Legacy CRUD routes (from legacy game.routes.js)
router.post('/', gameController.createGame);
router.get('/', gameController.listGames);
router.get('/:id', gameController.getGameById);
router.put('/:id', gameController.updateGame);
router.delete('/:id', gameController.deleteGame);

export { router as gameRouter };
