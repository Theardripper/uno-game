import { useShallow } from "zustand/react/shallow";

import { useRoomStore } from "./room.store";

/**
 * Hook responsável por expor o estado da sala.
 *
 * A UI nunca deve conhecer diretamente o Zustand.
 */
export function useRoom() {
    return useRoomStore(
        useShallow((state) => ({
            id: state.id,
            code: state.code,
            hostId: state.hostId,
            status: state.status,
            maxPlayers: state.maxPlayers,
            players: state.players,
            actions: state.actions,
        }))
    );
}
