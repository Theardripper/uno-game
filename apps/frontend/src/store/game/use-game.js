import { useShallow } from "zustand/react/shallow";

import { useGameStore } from "./game.store";

/**
 * Hook responsável por expor o estado do jogo.
 *
 * Utiliza useShallow para evitar re-renders desnecessários
 * quando propriedades não consumidas mudam.
 */
export const useGame = () => {
    return useGameStore(
        useShallow((state) => ({
            topCard: state.topCard,
            currentTurn: state.currentTurn,
            currentColor: state.currentColor,
            players: state.players,
            hand: state.hand,
            deckCount: state.deckCount,
            status: state.status,
            winnerId: state.winnerId,
            endReason: state.endReason,
            matchResults: state.matchResults,
            actions: state.actions,
        }))
    );
};
