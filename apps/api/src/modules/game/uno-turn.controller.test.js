import { jest } from '@jest/globals';
import { nextTurn, playCardTurn, drawCardTurn } from './uno-turn.controller.js';

function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe('uno-turn.controller', () => {
    it('nextTurn deve responder no formato {status, body} do enunciado', () => {
        const req = { body: { players: ['Alice', 'Bob', 'Charlie', 'Diana'], currentPlayerIndex: 1 } };
        const res = mockRes();
        const next = jest.fn();

        nextTurn(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            body: { nextPlayerIndex: 2, nextPlayer: 'Charlie' },
        });
    });

    it('playCardTurn deve responder o efeito de skip no formato {status, body}', () => {
        const req = { body: { cardPlayed: 'skip', currentPlayerIndex: 2, players: ['Alice', 'Bob', 'Charlie', 'Diana'], direction: 'clockwise' } };
        const res = mockRes();
        const next = jest.fn();

        playCardTurn(req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            body: { nextPlayerIndex: 0, nextPlayer: 'Alice', skippedPlayer: 'Diana' },
        });
    });

    it('drawCardTurn deve responder newHand/drawnCard/playable no formato do enunciado', () => {
        const req = {
            body: {
                playerHand: ['red_2', 'blue_5'],
                deck: ['green_4', 'yellow_skip', 'red_9'],
                currentCard: 'blue_7',
            },
        };
        const res = mockRes();
        const next = jest.fn();

        drawCardTurn(req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            body: {
                newHand: ['red_2', 'blue_5', 'green_4', 'yellow_skip', 'red_9'],
                drawnCard: 'red_9',
                playable: false,
            },
        });
    });

    it('deve chamar next(error) se o body vier malformado (ex: players undefined)', () => {
        const req = { body: {} };
        const res = mockRes();
        const next = jest.fn();

        nextTurn(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});