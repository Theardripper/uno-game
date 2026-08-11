"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppToast } from "@/hooks/use-app-toast";
import { roomService } from "@/services/room.service";
import { socketClient } from "@/socket/socket-client";
import { useAuth } from "@/store/auth/use-auth";
import { ArrowLeft, Copy, Play, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useRoom } from "@/store/room/use-room";
import { GameEvents, LobbyEvents, SystemEvents } from "@shared/socket/events";
export default function WaitingRoomPage() {
  const { code } = useParams();
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useAppToast();

  const roomState = useRoom();
  const room = roomState.code ? roomState : null;
  const setRoom = (roomData) => {
    if (roomData) {
      roomData.id = roomData.id || roomData._id;
      roomState.actions.setRoom(roomData);
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  const { accessToken } = useAuth();

  useEffect(() => {
    let mounted = true;

    const fetchRoom = async () => {
      try {
        const response = await roomService.getRoom(code);
        if (mounted) {
          setRoom(response.data?.room);
        }
      } catch (error) {
        if (mounted) {
          toastError("Não foi possível carregar a sala.", "Erro");
          router.push("/lobby");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, router, toastError]);

  // Setup Socket.IO
  useEffect(() => {
    if (!accessToken) return;

    // Conecta o socket se não estiver conectado
    if (!socketClient.isConnected()) {
      socketClient.connect(accessToken);
    }

    // Para o MVP: Como não temos um store de player pronto aqui,
    // vamos pegar o ID do token rudimentarmente (se for JWT padrão)
    // ou apenas enviar o token no auth e deixar o backend resolver.
    // Mas no meu gateway eu pedi playerId no payload. Vou extrair do JWT:
    let playerId = "unknown";
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      playerId = payload.id || payload.sub;
    } catch(e) {}

    const handleConnect = () => {
      console.log('[SOCKET CONNECTED]', {
        socketId: socketClient.id,
        userId: playerId,
        roomId: code
      });
      socketClient.emit(LobbyEvents.CLIENT_JOIN_ROOM, { roomCode: code, playerId });
    };

    if (socketClient.isConnected()) {
      handleConnect();
    }

    // SEMPRE escuta o evento connect para lidar com reconexões
    socketClient.on("connect", handleConnect);

    const onGameStarted = () => {
      toastSuccess("Redirecionando para o tabuleiro...", "Partida Iniciada!");
      router.push(`/game/${code}`);
    };

    const onGameError = (error) => {
      toastError(error.message || "Erro ao iniciar partida", "Atenção");
      setIsStarting(false);
    };

    socketClient.on(GameEvents.SERVER_GAME_STARTED, onGameStarted);
    socketClient.on(SystemEvents.SERVER_ERROR, onGameError);

    return () => {
      socketClient.off("connect", handleConnect);
      socketClient.off(GameEvents.SERVER_GAME_STARTED, onGameStarted);
      socketClient.off(SystemEvents.SERVER_ERROR, onGameError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, code, router, toastSuccess]);


  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toastSuccess("Código da sala copiado para a área de transferência.", "Copiado!");
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Carregando sala...</div>;
  }

  if (!room) return null;

  let currentUserId = "unknown";
  try {
    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      currentUserId = payload.id || payload.sub;
    }
  } catch(e) {}

  const isHost = room.hostId === currentUserId;
  const canStart = room.playerDetails?.length >= 2;
  const allPlayersReady = room.playerDetails?.every(p => p.ready) ?? false;
  const currentPlayer = room.playerDetails?.find(p => p.id === currentUserId);
  const isReady = currentPlayer?.ready ?? false;

  const handleToggleReady = () => {
    socketClient.emit(LobbyEvents.CLIENT_TOGGLE_READY, { roomCode: code });  };

  const handleStartGame = () => {
    if (isStarting) return;
    setIsStarting(true);
    socketClient.emit(LobbyEvents.CLIENT_START_GAME, { roomCode: code });
  };

  const handleLeaveRoom = () => {
    socketClient.emit(LobbyEvents.CLIENT_LEAVE_ROOM, { roomCode: code, playerId: currentUserId }, () => {
      router.push("/lobby");
    });
    // Fallback in case callback never fires
    setTimeout(() => {
      router.push("/lobby");
    }, 1000);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Button variant="ghost" onClick={handleLeaveRoom} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Lobby
        </Button>

        <Card className="border-primary/20 shadow-xl shadow-primary/10">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              Sala de Espera
            </CardTitle>
            <CardDescription className="text-lg mt-2 flex items-center justify-center gap-2">
              Código: <strong className="text-foreground tracking-widest">{code}</strong>
              <Button variant="outline" size="icon" className="h-8 w-8 ml-2" onClick={copyCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border">
              <span className="flex items-center gap-2 font-medium">
                <Users className="h-5 w-5 text-primary" />
                Jogadores
              </span>
              <Badge variant="secondary" className="text-sm">
                {room.playerDetails?.length || 0} / {room.maxPlayers}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {room.playerDetails?.map((player) => (
                <div key={player.id} className="flex items-center space-x-4 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={player.avatarSeed} alt={player.name} />
                    <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none flex items-center gap-2">
                      {player.name}
                      {player.id === room.hostId && (
                        <Badge variant="default" className="text-[10px] h-4 px-1.5 uppercase">Host</Badge>
                      )}
                      {player.ready ? (
                        <Badge variant="success" className="bg-green-500 text-white hover:bg-green-600 border-green-500 text-[10px] h-4 px-1.5 uppercase ml-auto">✓ Pronto</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground border-dashed text-[10px] h-4 px-1.5 uppercase ml-auto">○ Não pronto</Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Nível {player.level}</p>
                  </div>
                </div>
              ))}

              {/* Vagas vazias */}
              {Array.from({ length: room.maxPlayers - (room.playerDetails?.length || 0) }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center space-x-4 p-3 rounded-xl border border-dashed bg-muted/20 opacity-50">
                  <Avatar className="h-12 w-12 border-2 border-dashed">
                    <AvatarFallback className="bg-transparent">?</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">Aguardando...</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 flex flex-col items-center gap-4">
              <Button size="lg" variant={isReady ? "outline" : "default"} onClick={handleToggleReady} className="w-full max-w-sm h-12">
                {isReady ? "Cancelar Pronto" : "Pronto"}
              </Button>

              {isHost ? (
                <Button size="lg" className="w-full max-w-sm h-14 text-lg" disabled={!canStart || !allPlayersReady || isStarting} onClick={handleStartGame}>
                  <Play className="mr-2 h-6 w-6" />
                  {isStarting ? "Iniciando..." : (allPlayersReady ? "Iniciar Partida" : "Aguardando jogadores...")}
                </Button>
              ) : (
                <div className="text-center p-4 rounded-lg bg-muted/50 border border-muted w-full max-w-sm animate-pulse">
                  <p className="text-sm font-medium text-muted-foreground">Aguardando o host iniciar a partida...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
