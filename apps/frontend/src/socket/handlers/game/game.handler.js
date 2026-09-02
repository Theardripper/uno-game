import { toast } from "@/components/ui/toast";
import { socketClient } from "@/socket/socket-client";
import { useGameStore } from "@/store/game/game.store";
import { SocketEvents } from "@shared/socket/events";

/**
 * Registra os ouvintes do Socket.IO referentes ao estado da partida de UNO.
 */
export function registerGameHandlers() {
    console.log("[Socket] Registering game handlers...");

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
            endReason: data.reason,
            matchResults: data.results
        });
    };

    const onChallengeResult = (result) => {
        console.log('[CHALLENGE RESULT]', result);
        toast.add({
            title: "UNO!",
            description: result.message,
            type: result.success ? "warning" : "info",
        });
    };

    const onGameError = (error) => {
        console.error("Erro do jogo:", error?.message || error);
        toast.add({
            title: "Jogada inválida",
            description: error?.message || "Não foi possível concluir a ação.",
            type: "error",
        });
    };

    socketClient.on(SocketEvents.SERVER_GAME_STATE, onGameStateUpdated);
    socketClient.on(SocketEvents.SERVER_HAND_UPDATED, onHandUpdated);
    socketClient.on(SocketEvents.SERVER_GAME_STARTED, onGameStarted);
    socketClient.on(SocketEvents.SERVER_GAME_FINISHED, onGameFinished);
    socketClient.on(SocketEvents.SERVER_CHALLENGE_RESULT, onChallengeResult);
    socketClient.on(SocketEvents.SERVER_ERROR, onGameError);

    return () => {
        socketClient.off(SocketEvents.SERVER_GAME_STATE, onGameStateUpdated);
        socketClient.off(SocketEvents.SERVER_HAND_UPDATED, onHandUpdated);
        socketClient.off(SocketEvents.SERVER_GAME_STARTED, onGameStarted);
        socketClient.off(SocketEvents.SERVER_GAME_FINISHED, onGameFinished);
        socketClient.off(SocketEvents.SERVER_CHALLENGE_RESULT, onChallengeResult);
        socketClient.off(SocketEvents.SERVER_ERROR, onGameError);
    };
}
