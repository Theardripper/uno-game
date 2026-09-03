import { socketClient } from "@/socket/socket-client";
import { useGameStore } from "@/store/game/game.store";
import { useParams, useRouter } from "next/navigation";
import { GameEvents, LobbyEvents, SocketEvents } from "@shared/socket/events";
import { useCallback, useState } from "react";

/**
 * Hook para interações do usuário com a gameplay do UNO.
 * Abstrai os chamados ao Socket.IO para os componentes visuais.
 */
export const useGameActions = () => {
    const { code } = useParams();
    const router = useRouter();
    const [isLeaving, setIsLeaving] = useState(false);

    // Estado do seletor de cor para curingas.
    // pendingWildCard guarda a carta curinga que o jogador clicou,
    // enquanto aguardamos a escolha de cor no ColorPickerModal.
    const [pendingWildCard, setPendingWildCard] = useState(null);
    const isPickingColor = pendingWildCard !== null;

    /**
     * Tenta descartar uma carta da mão.
     * Se for curinga, abre o modal de cor em vez de emitir imediatamente.
     * @param {object} card A carta a ser jogada.
     */
    const playCard = useCallback((card) => {
        if (card.color === "wild") {
            // Segura o emit: abre o modal e aguarda confirmColor()
            setPendingWildCard(card);
            return;
        }

        socketClient.emit(SocketEvents.CLIENT_PLAY_CARD, {
            roomCode: code,
            cardId: card.id,
            color: card.color,
        });
    }, [code]);

    /**
     * Solicita a compra de uma carta do deck.
     */
    const drawCard = useCallback(() => {
        socketClient.emit(SocketEvents.CLIENT_DRAW_CARD, { roomCode: code });
    }, [code]);

    /**
     * Declara "UNO!" quando o jogador fica com poucas cartas na mão.
     */
    const callUno = useCallback(() => {
        socketClient.emit(SocketEvents.CLIENT_CALL_UNO, { roomCode: code });
    }, [code]);

    /**
     * Confirma a cor escolhida no ColorPickerModal para um curinga pendente.
     * Só emite CLIENT_PLAY_CARD agora, com a cor real, backend recebe tudo junto.
     * @param {string} color - "red" | "blue" | "green" | "yellow"
     */
    const confirmColor = useCallback((color) => {
        if (!pendingWildCard) return;
        socketClient.emit(SocketEvents.CLIENT_PLAY_CARD, {
            roomCode: code,
            cardId: pendingWildCard.id,
            color,
        });
        setPendingWildCard(null);
    }, [code, pendingWildCard]);

    /**
     * Sai da partida em andamento.
     * Reseta o store do jogo e redireciona para o lobby.
     */
    const leaveGame = useCallback(() => {
        if (isLeaving) return;
        setIsLeaving(true);

        socketClient.emit(LobbyEvents.CLIENT_LEAVE_ROOM, { roomCode: code }, () => {
            useGameStore.getState().actions.reset();
            router.push("/lobby");
        });

        // Fallback caso o callback nunca dispare
        setTimeout(() => {
            useGameStore.getState().actions.reset();
            router.push("/lobby");
        }, 1000);
    }, [code, isLeaving, router]);

    return {
        playCard,
        drawCard,
        callUno,
        leaveGame,
        isLeaving,
        isPickingColor,
        confirmColor,
    };
};
