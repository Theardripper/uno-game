import { Router } from 'express';
import * as scoreController from './score.controller.js';

const router = Router();

router.post('/', scoreController.createScore);
router.get('/game/:game_id', scoreController.getScoreHistory);
router.get('/:id', scoreController.getScoreById);
router.put('/:id', scoreController.updateScore);
router.delete('/:id', scoreController.deleteScore);

export { router as scoreRouter };
