import { Router } from 'express';
import { nextTurn, playCardTurn, drawCardTurn } from './uno-turn.controller.js';

const router = Router();

router.post('/nextTurn', nextTurn);
router.post('/playCard', playCardTurn);
router.post('/drawCard', drawCardTurn);

export const unoTurnRouter = router;