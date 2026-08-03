import { Router } from 'express';
import * as playerController from './player.controller.js';
import { extractUser } from '#middlewares/auth.middleware.js';

const router = Router();

router.post('/', playerController.createPlayer);
router.get('/me/stats', extractUser, playerController.getStats);
router.get('/me/history', extractUser, playerController.getHistory);
router.get('/me', extractUser, playerController.getMe);
router.get('/:id', playerController.getPlayerById);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);

export { router as playerRouter };
