import { toast } from "@/components/ui/toast";
import { socketClient } from "@/socket/socket-client";
import { useGameStore } from "@/store/game/game.store";
import { SocketEvents } from "@shared/socket/events";

// Referência de módulo para detectar mudança de topCard entre dois SERVER_GAME_STATE.
// Não pode ser um React state (esse arquivo não é um componente), então usamos variável de módulo.
let prevTopCardId = null;

// A carta inicial de uma partida pode ser skip/reverse/+2 por sorte do sorteio
// (o backend só re-embaralha se a primeira carta for curinga) — isso não é uma
// "jogada", então não deve gerar toast de feedback. SERVER_GAME_STARTED chega
// sempre antes do SERVER_GAME_STATE inicial (emitidos em sequência pelo backend),
// então essa flag pega exatamente a primeira atualização de estado da partida.
let skipNextTopCardToast = false;

// Guarda o último "saidUno" conhecido de cada jogador pra detectar a transição
// false -> true (o momento exato em que alguém diz UNO de verdade, confirmado
// pelo servidor) e disparar o anúncio pra mesa toda, não só pra quem clicou.
let prevSaidUnoMap = {};

/**
 * Registra os ouvintes do Socket.IO referentes ao estado da partida de UNO.
 */
export function registerGameHandlers() {
    console.log("[Socket] Registering game handlers...");

    const onGameStateUpdated = (state) => {
        console.log('[GAME STATE UPDATED]', state);

        // SOLUÇÃO TEMPORÁRIA: Detecta mudança de topCard para disparar feedback semântico.
        // SERVER_GAME_EVENT ainda não é emitido pelo backend.
        // Assim que o backend implementar a emissão do SERVER_GAME_EVENT (conforme contrato),
        // essa lógica deve ser removida por segurança, passando a ouvir o evento oficial do backend.
        if (state.topCard?.id && state.topCard.id !== prevTopCardId) {
            if (skipNextTopCardToast) {
                skipNextTopCardToast = false;
            } else {
                const toastMap = {
                    skip:           { title: "Turno pulado! ⏭", type: "info" },
                    reverse:        { title: "Direção invertida! 🔄", type: "info" },
                    draw_two:       { title: "Compre 2 cartas! +2", type: "warning" },
                    wild_draw_four: { title: "Compre 4 cartas! +4", type: "warning" },
                };
                const feedback = toastMap[state.topCard.value];
                if (feedback) {
                    toast.add({ title: feedback.title, type: feedback.type });
                }
            }
            prevTopCardId = state.topCard.id;
        }

        // Detecta quem acabou de dizer UNO (saidUno false -> true) pra avisar a mesa toda.
        state.players?.forEach((p) => {
            const wasSaid = prevSaidUnoMap[p.id] ?? false;
            if (p.saidUno && !wasSaid) {
                useGameStore.getState().actions.announceUno(p.id, p.name);
            }
            prevSaidUnoMap[p.id] = !!p.saidUno;
        });

        useGameStore.getState().actions.patchGame({
            status: state.status,
            topCard: state.topCard,
            currentColor: state.currentColor,
            currentTurn: state.currentTurn,
            deckCount: state.deckCount,
            players: state.players,
            direction: state.direction ?? "clockwise",
            ...(state.winnerId !== undefined ? { winnerId: state.winnerId } : {}),
            ...(state.endReason !== undefined ? { endReason: state.endReason } : {})
        });
    };

    const onHandUpdated = ({ hand }) => {
        console.log('[HAND UPDATED]', hand);
        useGameStore.getState().actions.setHand(hand);
    };

    const onGameStarted = () => {
        skipNextTopCardToast = true;
        prevSaidUnoMap = {};
        useGameStore.getState().actions.patchGame({ status: "playing" });
    };

    const onGameFinished = (data) => {
        console.log('[GAME FINISHED]', data);
        useGameStore.getState().actions.patchGame({
            status: "finished",
            winnerId: data.winnerId,
            endReason: data.reason,
            matchResults: data.results,
            matchDetails: data.matchDetails
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
