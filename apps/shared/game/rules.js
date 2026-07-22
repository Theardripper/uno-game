import { CardColor, CardValue } from "./constants.js";

/**
 * Checks if a card can be played on top of the current discard pile.
 * 
 * @param {import('../types/Card').Card} card - The card the player wants to play.
 * @param {import('../types/Card').Card} topCard - The current card on top of the discard pile.
 * @param {string} [currentWildColor] - The active color if the top card is a Wild card.
 * @returns {boolean} True if the card is playable, false otherwise.
 */
export function isPlayableCard(card, topCard, currentWildColor) {
    if (!card || !topCard) return false;

    // Wild cards can always be played
    if (card.color === CardColor.WILD) {
        return true;
    }

    // If top card is wild, we must match the chosen color (currentWildColor)
    if (topCard.color === CardColor.WILD) {
        return card.color === currentWildColor;
    }

    // Otherwise, we match either the color or the value
    return card.color === topCard.color || card.value === topCard.value;
}
