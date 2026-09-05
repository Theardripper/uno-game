import { getNextTurn, playCard, isCardPlayable, drawUntilPlayable } from './uno-turn.util.js';

describe('uno-turn.util', () => {
    const players = ['Alice', 'Bob', 'Charlie', 'Diana'];

    describe('getNextTurn', () => {
        it('deve avançar para o próximo jogador (exemplo do enunciado)', () => {
            expect(getNextTurn(players, 1)).toEqual({ nextPlayerIndex: 2, nextPlayer: 'Charlie' });
        });

        it('deve voltar ao início quando o último jogador terminar o turno', () => {
            expect(getNextTurn(players, 3)).toEqual({ nextPlayerIndex: 0, nextPlayer: 'Alice' });
        });
    });

    describe('playCard - skip', () => {
        it('deve pular o próximo jogador e avançar dois no sentido horário (exemplo do enunciado)', () => {
            const result = playCard({ cardPlayed: 'skip', currentPlayerIndex: 2, players, direction: 'clockwise' });
            expect(result).toEqual({ nextPlayerIndex: 0, nextPlayer: 'Alice', skippedPlayer: 'Diana' });
        });

        it('deve funcionar também no sentido anti-horário', () => {
            const result = playCard({ cardPlayed: 'skip', currentPlayerIndex: 2, players, direction: 'counterclockwise' });
            // de Charlie (2), anti-horário pula Bob (1) e vai para Alice (0)
            expect(result).toEqual({ nextPlayerIndex: 0, nextPlayer: 'Alice', skippedPlayer: 'Bob' });
        });
    });

    describe('playCard - reverse', () => {
        it('deve inverter a direção e avançar um jogador na nova direção (exemplo do enunciado)', () => {
            const result = playCard({ cardPlayed: 'reverse', currentPlayerIndex: 2, players, direction: 'clockwise' });
            expect(result).toEqual({ newDirection: 'counterclockwise', nextPlayerIndex: 1, nextPlayer: 'Bob' });
        });

        it('deve inverter de volta para o sentido horário quando já estava anti-horário', () => {
            const result = playCard({ cardPlayed: 'reverse', currentPlayerIndex: 1, players, direction: 'counterclockwise' });
            expect(result.newDirection).toBe('clockwise');
            expect(result.nextPlayerIndex).toBe(2);
        });
    });

    describe('playCard - carta comum', () => {
        it('deve apenas avançar o turno normalmente quando a carta não for skip nem reverse', () => {
            const result = playCard({ cardPlayed: 'red_5', currentPlayerIndex: 0, players, direction: 'clockwise' });
            expect(result).toEqual({ nextPlayerIndex: 1, nextPlayer: 'Bob' });
        });
    });

    describe('isCardPlayable', () => {
        it('deve ser jogável quando a cor bate', () => {
            expect(isCardPlayable('blue_5', 'blue_9')).toBe(true);
        });

        it('deve ser jogável quando o valor bate', () => {
            expect(isCardPlayable('red_5', 'blue_5')).toBe(true);
        });

        it('não deve ser jogável quando nem cor nem valor batem', () => {
            expect(isCardPlayable('green_4', 'blue_7')).toBe(false);
        });
    });

    describe('drawUntilPlayable', () => {
        it('deve comprar cartas até encontrar uma jogável', () => {
            const result = drawUntilPlayable({
                playerHand: ['red_2', 'blue_5'],
                deck: ['green_4', 'yellow_7', 'red_9'],
                currentCard: 'red_1',
            });

            // green_4 não bate com red_1 (cor nem valor) -> continua
            // yellow_7 não bate com red_1 -> continua
            // red_9 bate a cor (red) -> para aqui
            expect(result.newHand).toEqual(['red_2', 'blue_5', 'green_4', 'yellow_7', 'red_9']);
            expect(result.drawnCard).toBe('red_9');
            expect(result.playable).toBe(true);
        });

        it('deve parar quando a primeira carta comprada já for jogável', () => {
            const result = drawUntilPlayable({
                playerHand: ['red_2'],
                deck: ['blue_1', 'green_9'],
                currentCard: 'blue_5',
            });

            expect(result.newHand).toEqual(['red_2', 'blue_1']);
            expect(result.drawnCard).toBe('blue_1');
            expect(result.playable).toBe(true);
        });

        it('deve comprar o baralho inteiro e reportar playable:false se nenhuma carta servir', () => {
            const result = drawUntilPlayable({
                playerHand: ['red_2', 'blue_5'],
                deck: ['green_4', 'yellow_skip', 'red_9'],
                currentCard: 'blue_7',
            });

            expect(result.newHand).toEqual(['red_2', 'blue_5', 'green_4', 'yellow_skip', 'red_9']);
            expect(result.drawnCard).toBe('red_9');
            expect(result.playable).toBe(false);
            expect(result.remainingDeck).toEqual([]);
        });
    });
});