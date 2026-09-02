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

    /**
     * Tenta descartar uma carta da mão.
     * @param {object} card A carta a ser jogada.
     */
    const playCard = useCallback((card) => {
        let selectedColor = card.color;

        // MVP: Se for curinga, hardcodeamos "red".
        // TODO: No futuro, isso deve abrir um modal que passará a cor escolhida.
        if (selectedColor === "wild") {
            selectedColor = "red";
        }

        socketClient.emit(SocketEvents.CLIENT_PLAY_CARD, {
            roomCode: code,
            cardId: card.id,
            color: selectedColor
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
    };
};
