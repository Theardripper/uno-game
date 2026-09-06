import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppToast } from "@/hooks/use-app-toast";
import { ArrowLeft, Copy, Play, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useWaitingRoom } from "@/features/room/hooks/use-waiting-room";
import { useRoomActions } from "@/features/room/hooks/use-room-actions";
import { useGame } from "@/store/game/use-game";
import { socketClient } from "@/socket/socket-client";
import { SystemEvents } from "@shared/socket/events";

export function WaitingRoomWidget({ roomCode }) {
    const router = useRouter();
    const { error: toastError, success: toastSuccess } = useAppToast();

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

    // Observa o status do jogo para redirecionamento
    // O handler global (game.handler.js) já faz patchGame({status: "playing"}) 
    // ao receber SERVER_GAME_STARTED, então basta observar o store.
    const { status: gameStatus } = useGame();

    // Redireciona caso dê erro ao buscar
    useEffect(() => {
        if (fetchError) {
            toastError("Não foi possível carregar a sala.", "Erro");
            router.push("/lobby");
        }
    }, [fetchError, router, toastError]);

    // Redireciona quando a partida começa (status muda via handler global)
    useEffect(() => {
        if (gameStatus === "playing") {
            toastSuccess("Redirecionando para o tabuleiro...", "Partida Iniciada!");
            router.push(`/game/${roomCode}`);
        }
    }, [gameStatus, router, roomCode, toastSuccess]);

    // Ouve erros de socket para feedback visual
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
        return <div className="flex h-full items-center justify-center bg-auth-background text-white">Carregando sala...</div>;
    }

    if (!room) return null;

    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-4 bg-auth-background">
            <div className="w-full max-w-2xl">
                <Button variant="ghost" onClick={handleLeaveRoom} className="mb-4 text-white/70 hover:text-white hover:bg-white/10">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Lobby
                </Button>

                <Card className="bg-black/40 backdrop-blur-md border border-white/10 ring-0 shadow-2xl">
                    <CardHeader className="pb-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle className="text-3xl font-bold text-white uppercase font-(family-name:--font-baloo)">
                                    Sala de Espera
                                </CardTitle>
                                {hostName && (
                                    <CardDescription className="text-sm mt-1 text-gray-400 font-(family-name:--font-rubik)">
                                        Criado por {hostName}
                                    </CardDescription>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <Badge className="bg-black/50 text-white/80 border border-white/10 gap-1.5 font-(family-name:--font-rubik)">
                                    <Users className="h-3 w-3" />
                                    {room.playerDetails?.length || 0}/{room.maxPlayers} Jogadores
                                </Badge>
                                <Badge className="bg-black/50 text-white/80 border border-white/10 gap-1.5 font-(family-name:--font-rubik)">
                                    Código: <strong className="tracking-widest">{roomCode}</strong>
                                    <button onClick={copyCode} className="ml-1 hover:text-white">
                                        <Copy className="h-3 w-3" />
                                    </button>
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 font-(family-name:--font-rubik)">Jogadores</span>

                        <div className="grid grid-cols-2 gap-4">
                            {room.playerDetails?.map((player) => {
                                const isMe = player.id === playerId;
                                return (
                                    <div key={player.id} className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-colors ${isMe ? "border-auth-accent bg-auth-accent/10" : "border-white/10 bg-black/30"}`}>
                                        {isMe && (
                                            <Badge className="absolute top-2 left-2 bg-auth-accent text-auth-accent-foreground text-[9px] px-1.5 h-4 font-(family-name:--font-rubik)">Você</Badge>
                                        )}

                                        <div className="relative">
                                            <div className={`absolute inset-0 rounded-2xl blur-xl scale-125 ${isMe ? "bg-auth-accent/60" : "bg-auth-accent/20"}`} />
                                            <Avatar className="relative w-16 h-16 rounded-2xl after:rounded-2xl border-2 border-white/20">
                                                <AvatarImage src={player.avatarSeed} alt={player.name} className="rounded-2xl" />
                                                <AvatarFallback className="rounded-2xl">{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </div>

                                        {player.id === room.hostId && (
                                            <Badge className="bg-black/50 text-white/70 text-[9px] px-1.5 h-4 uppercase font-(family-name:--font-rubik)">Host</Badge>
                                        )}

                                        <span className="text-sm font-bold text-white truncate max-w-full font-(family-name:--font-rubik)">{player.name}</span>

                                        {player.ready ? (
                                            <span className="text-[10px] font-bold uppercase tracking-wide text-green-400 font-(family-name:--font-rubik)">● Pronto</span>
                                        ) : (
                                            <span className="text-[10px] font-bold uppercase tracking-wide text-white/40 font-(family-name:--font-rubik)">○ Não pronto</span>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Vagas vazias */}
                            {Array.from({ length: room.maxPlayers - (room.playerDetails?.length || 0) }).map((_, i) => (
                                <div key={`empty-${i}`} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-white/10 min-h-37.5">
                                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/15 flex items-center justify-center">
                                        <span className="text-white/30 text-xl">?</span>
                                    </div>
                                    <span className="text-xs font-medium text-white/30 font-(family-name:--font-rubik)">Vaga vazia</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 flex flex-col items-center gap-3">
                            <Button size="xl" variant={isReady ? "glass" : "accent"} onClick={toggleReady} fullWidth className="max-w-sm">
                                {isReady ? "Cancelar Pronto" : "Pronto"}
                            </Button>

                            {isHost ? (
                                <Button size="xl" variant="accent" fullWidth className="max-w-sm text-lg uppercase" disabled={!canStart || !allPlayersReady || isStarting} onClick={startGame}>
                                    <Play className="mr-2 h-6 w-6" />
                                    {isStarting ? "Iniciando..." : (allPlayersReady ? "Começar Partida" : "Aguardando jogadores...")}
                                </Button>
                            ) : (
                                <div className="text-center p-4 rounded-lg bg-black/30 border border-white/10 w-full max-w-sm animate-pulse">
                                    <p className="text-sm font-medium text-white/60 font-(family-name:--font-rubik)">Aguardando o host iniciar a partida...</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
