import { socketClient } from "@/socket/socket-client";
import { useGameStore } from "@/store/game/game.store";
import { SocketEvents } from "@shared/socket/events";

/**
 * Registra os ouvintes do Socket.IO referentes ao estado da partida de UNO.
 */
export function registerGameHandlers() {
    console.log("[Socket] Registering game handlers...");

    const onRoomStateUpdated = (room) => {
        if (room.playerDetails) {
            useGameStore.getState().actions.patchGame({ players: room.playerDetails });
        }
    };

    const onGameStateUpdated = (state) => {
        console.log('[GAME STATE UPDATED]', state);
        useGameStore.getState().actions.patchGame({
            status: state.status,
            topCard: state.topCard,
            currentColor: state.currentColor,
            currentTurn: state.currentTurn,
            deckCount: state.deckCount,
            players: state.players,
            ...(state.winnerId !== undefined ? { winnerId: state.winnerId } : {}),
            ...(state.endReason !== undefined ? { endReason: state.endReason } : {})
        });
    };

    const onHandUpdated = ({ hand }) => {
        console.log('[HAND UPDATED]', hand);
        useGameStore.getState().actions.setHand(hand);
    };

    const onGameStarted = () => {
        useGameStore.getState().actions.patchGame({ status: "playing" });
    };

    const onGameFinished = (data) => {
        console.log('[GAME FINISHED]', data);
        useGameStore.getState().actions.patchGame({
            status: "finished",
            winnerId: data.winnerId,
            endReason: data.reason
        });
    };

    const onGameError = (error) => {
        console.error("Erro do jogo:", error?.message || error);
    };

    socketClient.on(SocketEvents.SERVER_ROOM_STATE, onRoomStateUpdated);
    socketClient.on(SocketEvents.SERVER_GAME_STATE, onGameStateUpdated);
    socketClient.on(SocketEvents.SERVER_HAND_UPDATED, onHandUpdated);
    socketClient.on(SocketEvents.SERVER_GAME_STARTED, onGameStarted);
    socketClient.on(SocketEvents.SERVER_GAME_FINISHED, onGameFinished);
    socketClient.on(SocketEvents.SERVER_ERROR, onGameError);

    return () => {
        socketClient.off(SocketEvents.SERVER_ROOM_STATE, onRoomStateUpdated);
        socketClient.off(SocketEvents.SERVER_GAME_STATE, onGameStateUpdated);
        socketClient.off(SocketEvents.SERVER_HAND_UPDATED, onHandUpdated);
        socketClient.off(SocketEvents.SERVER_GAME_STARTED, onGameStarted);
        socketClient.off(SocketEvents.SERVER_GAME_FINISHED, onGameFinished);
        socketClient.off(SocketEvents.SERVER_ERROR, onGameError);
    };
}
