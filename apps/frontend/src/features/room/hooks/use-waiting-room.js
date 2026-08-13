import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { roomService } from "@/services/room.service";
import { socketClient } from "@/socket/socket-client";
import { useRoom } from "@/store/room/use-room";
import { LobbyEvents } from "@shared/socket/events";
import { useEffect, useState } from "react";

/**
 * Hook da sala de espera.
 *
 * - Busca os dados iniciais da sala via API HTTP.
 * - Conecta o Socket.IO e entra na sala.
 * - Fornece o estado reativo da sala a partir do Zustand.
 */
export function useWaitingRoom(roomCode) {
    const { playerId, isAuthenticated, accessToken } = useCurrentUser();
    const roomState = useRoom();

    // Usa o estado da store se ela tiver algum code populado (pelo fetch ou pelo handler global)
    const room = roomState.code ? roomState : null;
    const setRoom = roomState.actions.setRoom;

    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    // Fetch Room Inicial via API
    useEffect(() => {
        let mounted = true;

        const fetchRoom = async () => {
            try {
                const response = await roomService.getRoom(roomCode);
                if (mounted) {
                    const roomData = response.data?.room;
                    if (roomData) {
                        roomData.id = roomData.id || roomData._id;
                        setRoom(roomData);
                    }
                }
            } catch (error) {
                if (mounted) {
                    setFetchError(true);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchRoom();

        return () => {
            mounted = false;
        };
    }, [roomCode, setRoom]);

    useEffect(() => {
        if (!accessToken) return;

        // Conecta o socket se não estiver conectado
        if (!socketClient.isConnected()) {
            socketClient.connect(accessToken);
        }

        const handleConnect = () => {
            console.log('[SOCKET CONNECTED - WAITING ROOM]', {
                socketId: socketClient.id,
                userId: playerId,
                roomId: roomCode
            });
            socketClient.emit(LobbyEvents.CLIENT_JOIN_ROOM, { roomCode, playerId });
        };

        // Se já estiver conectado, entra na sala imediatamente
        if (socketClient.isConnected()) {
            handleConnect();
        }

        // SEMPRE escuta o evento connect para lidar com reconexões
        socketClient.on("connect", handleConnect);

        return () => {
            socketClient.off("connect", handleConnect);
        };
    }, [accessToken, playerId, roomCode]);

    // Dados derivados para a UI
    const isHost = room?.hostId === playerId;
    const canStart = (room?.playerDetails?.length || 0) >= 2;
    // Backend só exige que não-hosts estejam prontos
    const nonHostPlayers = room?.playerDetails?.filter(p => p.id !== room?.hostId) || [];
    const allPlayersReady = nonHostPlayers.length > 0 && nonHostPlayers.every(p => p.ready);
    const currentPlayer = room?.playerDetails?.find(p => p.id === playerId);
    const isReady = currentPlayer?.ready ?? false;

    return {
        room,
        isLoading,
        fetchError,
        isHost,
        canStart,
        allPlayersReady,
        isReady,
        playerId,
    };
}
