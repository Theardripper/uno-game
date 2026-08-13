/**
 * progression.js
 * Utilitários puros e centralizados para cálculo de progressão (Score, XP, Nível).
 * 
 * Regra de Nível (baseada na fórmula da US):
 * - XP Necessário = 100 * (Level - 1)^2
 * - Nível = floor(sqrt(XP / 100)) + 1
 * 
 * Regras de XP Base:
 * - Vitória normal: 100 XP
 * - Vitória por W.O.: 60 XP
 * - Derrota: 40 XP
 */

export const BASE_XP_WIN = 100;
export const BASE_XP_WO = 60;
export const BASE_XP_LOSS = 40;

/**
 * Calcula o nível baseado no XP total do jogador.
 * @param {number} totalXp - XP total atual do jogador.
 * @returns {number} O nível do jogador (mínimo 1).
 */
export function getLevel(totalXp) {
    if (totalXp <= 0) return 1;
    return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

/**
 * Retorna os dados completos de progresso baseados em um total de XP.
 * 
 * @param {number} totalXp - XP total atual.
 * @returns {Object} 
 *  - level: Nível atual
 *  - currentLevelXp: Quantidade de XP ganhos apenas dentro do nível atual
 *  - xpToNextLevel: Quanto XP falta para o próximo nível
 *  - progressPercentage: Percentual de progresso no nível atual (0-100)
 */
export function getLevelProgress(totalXp) {
    const level = getLevel(totalXp);
    
    // XP onde este nível começou
    const levelStartTotalXp = 100 * Math.pow(level - 1, 2);
    
    // XP onde o próximo nível começa
    const nextLevelTotalXp = 100 * Math.pow(level, 2);

    // O XP ganho após atingir este nível
    const currentLevelXp = totalXp - levelStartTotalXp;
    
    // O tamanho total da barra de progresso (do nivel atual até o proximo)
    const levelSize = nextLevelTotalXp - levelStartTotalXp;
    
    // Quanto XP falta para o próximo nível
    const xpToNextLevel = nextLevelTotalXp - totalXp;
    
    const progressPercentage = Math.floor((currentLevelXp / levelSize) * 100);

    return {
        level,
        totalXp,
        currentLevelXp,
        nextLevelXp: nextLevelTotalXp, 
        levelStartTotalXp,
        levelSize,
        xpToNextLevel,
        progressPercentage
    };
}

/**
 * Calcula o XP ganho na partida.
 * 
 * @param {number} matchScore - Score feito (soma das cartas, etc).
 * @param {string} result - "WIN", "LOSS" ou "WO"
 * @returns {number} O XP ganho na partida.
 */
export function calculateXpEarned(matchScore, result) {
    let baseXp = 0;
    
    if (result === "WIN") {
        baseXp = BASE_XP_WIN;
    } else if (result === "WO") {
        baseXp = BASE_XP_WO;
    } else if (result === "LOSS") {
        baseXp = BASE_XP_LOSS;
    }

    const performanceXp = Math.floor(Math.max(0, matchScore) / 10);
    return baseXp + performanceXp;
}
