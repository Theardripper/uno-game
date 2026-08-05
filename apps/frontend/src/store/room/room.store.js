import { create } from "zustand";

/**
 * Estado inicial do Lobby.
 *
 * Representa o snapshot da sala enviado pelo backend.
 */
const initialState = {
    id: null,
    code: null,
    hostId: null,
    status: null,
    maxPlayers: 0,
    players: [],
    playerDetails: [],
};

/**
 * Store responsável pelo estado do Lobby.
 *
 * Responsabilidades:
 * - Armazenar o estado atual da sala.
 * - Expor ações para atualizar esse estado.
 *
 * Não deve conter regras de negócio.
 */
export const useRoomStore = create((set) => ({
    /**
     * ==========================================
     * State
     * ==========================================
     */
    ...initialState,

    /**
     * ==========================================
     * Actions
     * ==========================================
     */
    actions: {
        /**
         * Substitui completamente o estado da sala.
         *
         * Utilizado quando o backend envia um novo
         * snapshot completo através do evento:
         *
         * SERVER_ROOM_STATE
         *
         * @param {Object} room Estado completo da sala.
         */
        setRoom(room) {
            set(() => ({
                ...initialState,
                ...room,
            }));
        },

        /**
         * Atualiza parcialmente o estado da sala.
         *
         * Utilizado por eventos menores como:
         *
         * - SERVER_PLAYER_JOINED
         * - SERVER_PLAYER_LEFT
         * - SERVER_PLAYER_READY
         *
         * @param {Object} partialRoom Parte do estado a ser atualizada.
         */
        patchRoom(partialRoom) {
            set((state) => ({
                ...state,
                ...partialRoom,
            }));
        },

        /**
         * Limpa completamente o estado da sala.
         *
         * Utilizado quando:
         *
         * - jogador sai da sala;
         * - logout;
         * - conexão encerrada.
         */
        reset() {
            set(() => ({
                ...initialState,
            }));
        },
    },
}));
