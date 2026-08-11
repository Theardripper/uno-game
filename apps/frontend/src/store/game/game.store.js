import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GAME_CONSTANTS } from "@/constants/game.constants";

/**
 * @typedef {Object} Card
 * @property {string} id - UUID da carta
 * @property {string} color - red, blue, green, yellow, wild
 * @property {string} value - 0-9, skip, reverse, draw_two, wild, wild_draw_four
 * @property {string} [type] - Opcional. No frontend, atualizado/inferido para identificar tipo da carta.
 */

/**
 * @typedef {Object} Player
 * @property {string} id - Socket ID / User ID do jogador
 * @property {string} name - Nome de exibição
 * @property {string} avatarSeed - Semente para o DiceBear avatar
 * @property {number} cardCount - Quantidade de cartas na mão do oponente
 * @property {boolean} isConnected - Status de conexão
 */

/**
 * @typedef {Object} GameState
 * @property {Card|null} topCard - Carta no topo da pilha de descarte
 * @property {string|null} currentTurn - ID do jogador da vez
 * @property {string|null} currentColor - Cor atual em jogo (importante após um curinga)
 * @property {Player[]} players - Lista de jogadores ordenados pela ordem de jogo
 * @property {Card[]} hand - A mão de cartas do jogador local
 * @property {number} deckCount - Quantas cartas restam no deck de compras
 * @property {'waiting'|'playing'|'finished'} status - Status geral do jogo
 */

/** @type {GameState} */
const initialState = {
    topCard: null,
    currentTurn: null,
    currentColor: null,
    players: [],
    hand: [],
    deckCount: GAME_CONSTANTS.TOTAL_DECK_CARDS,
    status: "waiting",
    winnerId: null,
    endReason: null,
};

export const useGameStore = create(
    devtools(
        (set) => ({
            ...initialState,

            actions: {
                setTopCard: (card) => set({ topCard: card }, false, "game/setTopCard"),
                setTurn: (playerId) => set({ currentTurn: playerId }, false, "game/setTurn"),
                setColor: (color) => set({ currentColor: color }, false, "game/setColor"),
                updatePlayers: (players) => set({ players }, false, "game/updatePlayers"),
                setHand: (hand) => set({ hand }, false, "game/setHand"),
                patchGame: (partialGame) =>
                    set((state) => ({ ...state, ...partialGame }), false, "game/patchGame"),
                reset: () => set(initialState, false, "game/reset"),
            },
        }),
        { name: "GameStore" }
    )
);
