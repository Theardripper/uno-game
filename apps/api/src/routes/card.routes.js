import { Router } from 'express';
import {
  createCard,
  getCardById,
  updateCard,
  deleteCard,
} from '../controllers/card.controller.js';

const router = Router();

router.post('/', createCard);
router.get('/:id', getCardById);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

export default router;