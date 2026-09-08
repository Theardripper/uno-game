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
    isPrivate: true,
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
            set((state) => {
                let newPlayerDetails = room.playerDetails;
                
                if (!newPlayerDetails && room.players) {
                    newPlayerDetails = (state.playerDetails || [])
                        .filter(pd => room.players.some(p => p.id === pd.id))
                        .map(pd => {
                            const updatedPlayer = room.players.find(p => p.id === pd.id);
                            if (!updatedPlayer) return pd;
                            return {
                                ...pd,
                                ready: updatedPlayer.isReady,
                                isHost: updatedPlayer.isHost,
                                connected: updatedPlayer.connected
                            };
                        });
                    
                    const existingIds = new Set(newPlayerDetails.map(p => p.id));
                    const newPlayers = room.players.filter(p => !existingIds.has(p.id));
                    
                    for (const np of newPlayers) {
                        newPlayerDetails.push({
                            id: np.id,
                            name: np.name,
                            ready: np.isReady,
                            isHost: np.isHost,
                            connected: np.connected,
                            level: np.level || 1,
                            avatarSeed: np.avatarSeed || `https://api.dicebear.com/9.x/avataaars/svg?seed=${np.name}`,
                        });
                    }
                }

                return {
                    ...initialState,
                    ...room,
                    id: state.id || room.id,
                    isPrivate: room.isPrivate !== undefined ? room.isPrivate : state.isPrivate,
                    playerDetails: newPlayerDetails || state.playerDetails || [],
                };
            });
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
