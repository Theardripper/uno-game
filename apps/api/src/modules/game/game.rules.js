/**
 * Módulo de validação de regras do UNO
 */

/**
 * Verifica se uma carta pode ser jogada.
 *
 * @param {Card} cardToPlay - A carta que o jogador quer descartar
 * @param {Card} topCard - A carta que está no topo do monte
 * @param {CardColor} currentColor - A cor exigida para a rodada atual
 * @returns {boolean}
 */
export const canPlayCard = (cardToPlay, topCard, currentColor) => {
    // 1. Cartas Wild (Curingas) sempre podem ser jogadas, independentemente do topo ou da cor.
    // (A regra oficial de "desafio" do +4 será implementada em outra etapa)
    if (cardToPlay.color === "wild") {
        return true;
    }

    // 2. A carta bate com a cor exigida no momento
    if (cardToPlay.color === currentColor) {
        return true;
    }

    // 3. A carta bate com o número/símbolo da carta do topo
    if (cardToPlay.value === topCard.value) {
        return true;
    }

    return false;
};
