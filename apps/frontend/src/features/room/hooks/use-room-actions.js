import { socketClient } from "@/socket/socket-client";
import { LobbyEvents } from "@shared/socket/events";
import { useCallback, useState } from "react";

/**
 * Hook para as ações do usuário na sala de espera.
 */
export function useRoomActions(roomCode, playerId) {
    const [isStarting, setIsStarting] = useState(false);

    const toggleReady = useCallback(() => {
        socketClient.emit(LobbyEvents.CLIENT_TOGGLE_READY, { roomCode });
    }, [roomCode]);

    const startGame = useCallback(() => {
        if (isStarting) return;
        setIsStarting(true);
        socketClient.emit(LobbyEvents.CLIENT_START_GAME, { roomCode });
    }, [roomCode, isStarting]);

    const leaveRoom = useCallback((onLeaveCallback) => {
        socketClient.emit(LobbyEvents.CLIENT_LEAVE_ROOM, { roomCode, playerId }, () => {
            if (onLeaveCallback) onLeaveCallback();
        });

        // Fallback in case callback never fires
        setTimeout(() => {
            if (onLeaveCallback) onLeaveCallback();
        }, 1000);
    }, [roomCode, playerId]);

    return {
        isStarting,
        toggleReady,
        startGame,
        leaveRoom,
    };
}
