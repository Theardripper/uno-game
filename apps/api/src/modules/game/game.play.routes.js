import { Router } from 'express';
import { extractUser } from '#middlewares/auth.middleware.js';
import {
    playCard,
    drawCard,
    sayUno,
    challengePlayer,
    getMyHand,
    getGameHistory,
    getLiveScores,
    getGameStatus,
    checkHasValidMove,
} from './game.play.controller.js';

const router = Router();

// Todas as ações de jogo exigem um usuário autenticado (req.user.id)
router.use(extractUser);

router.get('/:roomCode/status', getGameStatus);
router.get('/:roomCode/hand', getMyHand);
router.get('/:roomCode/history', getGameHistory);
router.get('/:roomCode/scores', getLiveScores);
router.get('/:roomCode/valid-move', checkHasValidMove);

router.post('/:roomCode/play', playCard);
router.post('/:roomCode/draw', drawCard);
router.post('/:roomCode/uno', sayUno);
router.post('/:roomCode/challenge', challengePlayer);

export const gamePlayRouter = router;