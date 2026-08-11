import { socketClient } from "@/socket/socket-client";
import { useParams } from "next/navigation";
import { SocketEvents } from "@shared/socket/events";

/**
 * Hook para interações do usuário com a gameplay do UNO.
 * Abstrai os chamados ao Socket.IO para os componentes visuais.
 */
export const useGameActions = () => {
    const { code } = useParams();

    /**
     * Tenta descartar uma carta da mão.
     * @param {Card} card A carta a ser jogada.
     */
    const playCard = (card) => {
        let selectedColor = card.color;

        // MVP: Se for curinga, hardcodeamos "red".
        // No futuro, isso pode abrir um modal que passará a cor escolhida.
        if (selectedColor === "wild") {
            selectedColor = "red";
        }

        socketClient.emit(SocketEvents.CLIENT_PLAY_CARD, {
            roomCode: code,
            cardId: card.id,
            color: selectedColor
        });
    };

    /**
     * Solicita a compra de uma carta do deck.
     */
    const drawCard = () => {
        socketClient.emit(SocketEvents.CLIENT_DRAW_CARD, { roomCode: code });
    };

    return {
        playCard,
        drawCard
    };
};
