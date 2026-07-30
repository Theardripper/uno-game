"use client";

import { QueryKeys } from "@/query/query-keys";
import { getHealth } from "@/services/health.service";
import { useRoom } from "@/store/room/use-room";
import { socketClient } from "@socket/socket-client";
import { useQuery } from "@tanstack/react-query";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";

export default function Page() {
  const room = useRoom();

  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: QueryKeys.HEALTH,
    queryFn: getHealth,
  });

  const handleConnect = () => socketClient.connect("token-jwt-falso");

  const handleDisconnect = () => {
    socketClient.disconnect();
    room.actions.reset();
  };

  return (
    <FadeIn className="space-y-8 w-full max-w-4xl mx-auto">
      <div className="flex gap-4">
        <Button onClick={handleConnect} variant="default">
          Conectar
        </Button>

        <Button onClick={handleDisconnect} variant="destructive">
          Desconectar
        </Button>
      </div>

      <hr className="border-border" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* STATUS DA API */}
        <div className="bg-card border text-card-foreground p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Status da API</h2>
          {isLoading || isFetching ? (
            <p className="text-muted-foreground animate-pulse">Carregando...</p>
          ) : error ? (
            <p className="text-destructive font-medium">
              Erro: {error.message}
            </p>
          ) : (
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
          <Button
            onClick={() => refetch()}
            variant="secondary"
            className="mt-4"
          >
            Tentar Novamente
          </Button>
        </div>

        {/* STATUS DO SOCKET */}
        <div className="bg-card border text-card-foreground p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Status do Web Socket</h2>

          <p className="mb-2">
            <strong>Sala:</strong> {room.code || "Nenhuma"}
          </p>
          <p className="mb-2">
            <strong>Status:</strong> {room.status || "Desconectado"}
          </p>
          <p className="mb-4">
            <strong>Jogadores:</strong> {room.players?.length || 0}
          </p>

          <Button
            onClick={() =>
              room.actions.joinRoom("a5ebcd24-34ad-43db-8260-29aefb6a5ab1")
            }
          >
            Simular entrada na sala
          </Button>
        </div>
      </div>
    </FadeIn>
  );
}
