/**
 * Funções puras de regra de turno do UNO (OPÇÃO 1 do enunciado).
 * Não dependem de estado salvo — recebem tudo que precisam via parâmetros
 * e devolvem o resultado, sem efeitos colaterais.
 */

/**
 * 1. Avança para o próximo jogador no sentido horário padrão.
 */
export function getNextTurn(players, currentPlayerIndex) {
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    return { nextPlayerIndex, nextPlayer: players[nextPlayerIndex] };
}

/**
 * 2 e 3. Aplica o efeito de uma carta jogada (skip, reverse, ou carta comum)
 * e calcula o próximo jogador.
 */
export function playCard({ cardPlayed, currentPlayerIndex, players, direction }) {
    const total = players.length;
    const step = direction === 'clockwise' ? 1 : -1;
    const wrap = (index) => ((index % total) + total) % total;

    if (cardPlayed === 'skip') {
        const skippedIndex = wrap(currentPlayerIndex + step);
        const nextPlayerIndex = wrap(currentPlayerIndex + step * 2);
        return {
            nextPlayerIndex,
            nextPlayer: players[nextPlayerIndex],
            skippedPlayer: players[skippedIndex],
        };
    }

    if (cardPlayed === 'reverse') {
        const newDirection = direction === 'clockwise' ? 'counterclockwise' : 'clockwise';
        const newStep = newDirection === 'clockwise' ? 1 : -1;
        const nextPlayerIndex = wrap(currentPlayerIndex + newStep);
        return {
            newDirection,
            nextPlayerIndex,
            nextPlayer: players[nextPlayerIndex],
        };
    }

    // Carta comum: apenas avança o turno normalmente, respeitando a direção
    const nextPlayerIndex = wrap(currentPlayerIndex + step);
    return { nextPlayerIndex, nextPlayer: players[nextPlayerIndex] };
}

/**
 * Extrai cor e valor de uma carta no formato "cor_valor" (ex: "red_9", "yellow_skip").
 */
function parseCard(card) {
    const [color, ...rest] = card.split('_');
    return { color, value: rest.join('_') };
}

/**
 * Verifica se uma carta pode ser jogada sobre a carta atual (cor ou valor batem).
 */
export function isCardPlayable(card, currentCard) {
    const a = parseCard(card);
    const b = parseCard(currentCard);
    return a.color === b.color || a.value === b.value;
}

/**
 * 4. Compra cartas do baralho, uma por vez, até conseguir uma jogável
 * (ou até o baralho acabar). Todas as cartas compradas ficam na mão,
 * mesmo as não jogáveis pelo caminho.
 */
export function drawUntilPlayable({ playerHand, deck, currentCard }) {
    const newHand = [...playerHand];
    const remainingDeck = [...deck];
    let drawnCard = null;
    let playable = false;

    while (remainingDeck.length > 0) {
        drawnCard = remainingDeck.shift();
        newHand.push(drawnCard);
        if (isCardPlayable(drawnCard, currentCard)) {
            playable = true;
            break;
        }
    }

    return { newHand, drawnCard, playable, remainingDeck };
}