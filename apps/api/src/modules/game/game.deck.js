import { randomUUID } from "crypto";

const COLORS = ["red", "blue", "green", "yellow"];

/**
 * Retorna os pontos baseado no valor da carta
 */
const getCardScore = (value) => {
    if (value === "wild" || value === "wild_draw_four") return 50;
    if (value === "skip" || value === "reverse" || value === "draw_two") return 20;
    return parseInt(value, 10) || 0;
};

/**
 * Cria o deck padrão de UNO (108 cartas)
 * @returns {Card[]}
 */
export const createDeck = () => {
    const deck = [];

    // Para cada cor, cria as numéricas e de ação
    for (const color of COLORS) {
        // Carta '0' (apenas uma por cor)
        deck.push({ id: randomUUID(), color, value: "0", score: getCardScore("0") });

        // Cartas '1' a '9' (duas por cor)
        for (let i = 1; i <= 9; i++) {
            deck.push({ id: randomUUID(), color, value: String(i), score: getCardScore(String(i)) });
            deck.push({ id: randomUUID(), color, value: String(i), score: getCardScore(String(i)) });
        }

        // Cartas de Ação (duas por cor)
        const actions = ["skip", "reverse", "draw_two"];
        for (const action of actions) {
            deck.push({ id: randomUUID(), color, value: action, score: getCardScore(action) });
            deck.push({ id: randomUUID(), color, value: action, score: getCardScore(action) });
        }
    }

    // Cartas Wild (4 de cada)
    for (let i = 0; i < 4; i++) {
        deck.push({ id: randomUUID(), color: "wild", value: "wild", score: getCardScore("wild") });
        deck.push({ id: randomUUID(), color: "wild", value: "wild_draw_four", score: getCardScore("wild_draw_four") });
    }

    return deck;
};

/**
 * Embaralha um array de cartas in-place
 * @param {Card[]} deck
 */
export const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

/**
 * Compra N cartas do topo do deck
 */
export const drawCards = (deck, count = 1) => {
    const drawn = [];
    for (let i = 0; i < count; i++) {
        if (deck.length > 0) {
            drawn.push(deck.pop());
        }
    }
    return drawn;
};
