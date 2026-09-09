import { useAppToast } from "@/hooks/use-app-toast";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { roomService } from "@/services/room.service";

import { useWaitingRoom } from "@/features/room/hooks/use-waiting-room";
import { useRoomActions } from "@/features/room/hooks/use-room-actions";
import { useRoom } from "@/store/room/use-room";
import { useGame } from "@/store/game/use-game";
import { socketClient } from "@/socket/socket-client";
import { SystemEvents } from "@shared/socket/events";
import { cn } from "@/helpers/cn";

import { WaitingRoomHeader } from "./waiting-room-header";
import { PlayersGrid } from "./players-grid";
import { RoomChat } from "./room-chat";
import { InviteFriends } from "./invite-friends";

export function WaitingRoomWidget({ roomCode }) {
    const router = useRouter();
    const { error: toastError, success: toastSuccess } = useAppToast();
    const { actions: { setRoom } } = useRoom();

    const {
        room,
        isLoading,
        fetchError,
        isHost,
        canStart,
        allPlayersReady,
        isReady,
        playerId
    } = useWaitingRoom(roomCode);

    const { toggleReady, startGame, leaveRoom, isStarting } = useRoomActions(roomCode, playerId);
    const { status: gameStatus } = useGame();

    useEffect(() => {
        if (fetchError) {
            toastError("Não foi possível carregar a sala.", "Erro");
            router.push("/lobby");
        }
    }, [fetchError, router, toastError]);

    useEffect(() => {
        if (gameStatus === "playing") {
            toastSuccess("Redirecionando para o tabuleiro...", "Partida Iniciada!");
            router.push(`/game/${roomCode}`);
        }
    }, [gameStatus, router, roomCode, toastSuccess]);

    useEffect(() => {
        const onGameError = (error) => {
            toastError(error.message || "Erro ao iniciar partida", "Atenção");
        };

        socketClient.on(SystemEvents.SERVER_ERROR, onGameError);

        return () => {
            socketClient.off(SystemEvents.SERVER_ERROR, onGameError);
        };
    }, [toastError]);

    const hostName = room?.playerDetails?.find(p => p.id === room?.hostId)?.name;

    const togglePrivacy = async () => {
        try {
            await roomService.updateRoom(room.id, { isPrivate: !room.isPrivate });
            setRoom({ ...room, isPrivate: !room.isPrivate });
            toastSuccess(`Sala agora é ${!room.isPrivate ? "Privada" : "Pública"}`, "Atualizado");
        } catch (error) {
            console.error("TOGGLE PRIVACY ERROR:", error);
            toastError("Erro ao alterar privacidade da sala.", "Erro");
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(roomCode);
        toastSuccess("Código da sala copiado para a área de transferência.", "Copiado!");
    };

    const handleLeaveRoom = () => {
        leaveRoom(() => {
            router.push("/lobby");
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center text-white">
                <span className="animate-pulse">Carregando sala...</span>
            </div>
        );
    }

    if (!room) return null;

    return (
        <div className="max-w-[1200px] mx-auto w-full h-full flex flex-col pt-2">
            <button 
                onClick={handleLeaveRoom}
                className="self-start flex items-center gap-2 text-white/50 hover:text-white mb-4 text-xs font-bold uppercase tracking-widest transition-colors"
            >
                ← Sair da Sala
            </button>

            <WaitingRoomHeader 
                hostName={hostName} 
                playerCount={room.playerDetails?.length || 0} 
                maxPlayers={room.maxPlayers} 
                roomCode={roomCode} 
                isHost={isHost}
                isPrivate={room.isPrivate}
                onTogglePrivacy={togglePrivacy}
                onCopyCode={copyCode} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                {/* Left Side: Players Grid and Action Button */}
                <div className="lg:col-span-2 flex flex-col h-full min-h-0">
                    <div className="flex-1 min-h-0">
                        <PlayersGrid room={room} playerId={playerId} />
                    </div>

                    <div className="mt-6 shrink-0 pb-6">
                        {isHost ? (
                            <button
                                disabled={!canStart || !allPlayersReady || isStarting}
                                onClick={startGame}
                                className={cn(
                                    "w-full h-16 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-xl md:text-2xl tracking-widest uppercase transition-all shadow-[0_0_40px_rgba(255,69,58,0.3)]",
                                    (!canStart || !allPlayersReady || isStarting) 
                                        ? "bg-gray-800 text-gray-500 shadow-none cursor-not-allowed border border-white/5" 
                                        : "bg-gradient-to-r from-[#FF5545] to-[#C0000A] hover:from-[#FF453A] hover:to-[#A00008] hover:shadow-[0_0_50px_rgba(255,69,58,0.5)] border-b-4 border-[#8B0000]"
                                )}
                            >
                                {isStarting ? "Iniciando..." : "Começar Partida"}
                                {!isStarting && <Play className="w-5 h-5 fill-current" />}
                            </button>
                        ) : (
                            <button
                                onClick={toggleReady}
                                className={cn(
                                    "w-full h-16 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-xl md:text-2xl tracking-widest uppercase transition-all",
                                    isReady
                                        ? "bg-black/40 border border-white/10 hover:bg-black/60 text-white/70"
                                        : "bg-gradient-to-r from-[#FF5545] to-[#C0000A] hover:from-[#FF453A] hover:to-[#A00008] shadow-[0_0_40px_rgba(255,69,58,0.3)] border-b-4 border-[#8B0000]"
                                )}
                            >
                                {isReady ? "Cancelar Pronto" : "Estou Pronto"}
                            </button>
                        )}
                        
                        {!isHost && (
                            <p className="text-center text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-4">
                                Aguardando o host iniciar a partida
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Side: Online Friends and Chat */}
                <div className="lg:col-span-1 flex flex-col h-full min-h-0 pb-6">
                    <InviteFriends />
                    <RoomChat />
                </div>
            </div>
        </div>
    );
}
