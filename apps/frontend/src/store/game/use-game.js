import { useGameStore as store } from "./game.store";

/**
 * Hook para acessar o store do jogo de forma mais direta.
 * Mantemos o padrão do room.store.js
 */
export const useGame = () => {
    return store((state) => state);
};
