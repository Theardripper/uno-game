/**
 * @typedef {'red' | 'blue' | 'green' | 'yellow' | 'wild'} CardColor
 *
 * @typedef {'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'skip' | 'reverse' | 'draw_two' | 'wild' | 'wild_draw_four'} CardValue
 *
 * @typedef {Object} Card
 * @property {string} [id] - Unique identifier for the card (optional, useful for frontend key mapping)
 * @property {CardColor} color - The color of the card
 * @property {CardValue} value - The value or action of the card
 * @property {number} score - Points value of the card (0-9 for numbers, 20 for actions, 50 for wilds)
 */

export {};
