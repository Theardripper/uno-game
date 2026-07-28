import { Router } from 'express';
import {
  createGame,
  getGameById,
  updateGame,
  deleteGame,
} from '../controllers/game.controller.js';

const router = Router();

router.post('/', createGame);
router.get('/:id', getGameById);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);

export default router;