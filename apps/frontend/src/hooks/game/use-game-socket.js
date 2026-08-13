import { LobbyEvents } from "@shared/socket/events";
import { useEffect, useState } from "react";
import { socketClient } from "@/socket/socket-client";
import { useGame } from "@/store/game/use-game";

/**
 * Hook para gerenciar a entrada na sala via Socket.IO
 * e o reset do estado da partida de UNO ao sair.
 *
 * @param {string} roomCode O código da sala atual
 * @param {string} playerId O ID do jogador local (obtido via auth)
 */
export const useGameSocket = (roomCode, playerId) => {
    const { actions: { reset } } = useGame();
    const [isConnecting, setIsConnecting] = useState(true);

    useEffect(() => {
        if (!roomCode || !playerId) return;

        const handleConnect = () => {
            setIsConnecting(false);
            console.log('[GAME SOCKET CONNECTED]', { socketId: socketClient.id, roomId: roomCode });
            socketClient.emit(LobbyEvents.CLIENT_JOIN_ROOM, { roomCode, playerId });
        };

        if (socketClient.isConnected()) {
            handleConnect();
        }

        socketClient.on("connect", handleConnect);

        return () => {
            socketClient.off("connect", handleConnect);
            reset(); // Reseta o store do jogo ao sair da tela da partida
        };
    }, [roomCode, playerId, reset]);

    return { isConnecting };
};
