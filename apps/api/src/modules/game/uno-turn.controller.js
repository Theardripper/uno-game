import { getNextTurn, playCard, drawUntilPlayable } from './uno-turn.util.js';

export const nextTurn = (req, res, next) => {
    try {
        const { players, currentPlayerIndex } = req.body;
        const result = getNextTurn(players, currentPlayerIndex);
        return res.status(200).json({ status: 200, body: result });
    } catch (error) {
        next(error);
    }
};

export const playCardTurn = (req, res, next) => {
    try {
        const result = playCard(req.body);
        return res.status(200).json({ status: 200, body: result });
    } catch (error) {
        next(error);
    }
};

export const drawCardTurn = (req, res, next) => {
    try {
        const { playerHand, deck, currentCard } = req.body;
        const { newHand, drawnCard, playable } = drawUntilPlayable({ playerHand, deck, currentCard });
        return res.status(200).json({ status: 200, body: { newHand, drawnCard, playable } });
    } catch (error) {
        next(error);
    }
};