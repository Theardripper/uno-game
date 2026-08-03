import { Router } from 'express';
import * as cardController from './card.controller.js';

const router = Router();

router.post('/', cardController.createCard);
router.get('/:id', cardController.getCardById);
router.put('/:id', cardController.updateCard);
router.delete('/:id', cardController.deleteCard);

export { router as cardRouter };
