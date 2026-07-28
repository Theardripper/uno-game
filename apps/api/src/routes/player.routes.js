import { Router } from 'express';
import {
  createPlayer,
  getPlayerById,
  updatePlayer,
  deletePlayer,
} from '../controllers/player.controller.js';

const router = Router();

router.post('/', createPlayer);
router.get('/:id', getPlayerById);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

export default router;