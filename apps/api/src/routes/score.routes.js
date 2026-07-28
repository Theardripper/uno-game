import { Router } from 'express';
import {
  createScore,
  getScoreById,
  updateScore,
  deleteScore,
} from '../controllers/score.controller.js';

const router = Router();

router.post('/', createScore);
router.get('/:id', getScoreById);
router.put('/:id', updateScore);
router.delete('/:id', deleteScore);

export default router;