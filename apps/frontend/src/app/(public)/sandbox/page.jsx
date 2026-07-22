"use client";

import { getHealth } from "@/api/health.api";
import { QueryKeys } from "@/query/query-keys";
import { useRoom } from "@/store/room/use-room";
import { socketClient } from "@socket/socket-client";
import { useQuery } from "@tanstack/react-query";

export default function Page() {

    const room = useRoom();

    const {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
} = useQuery({
    queryKey: QueryKeys.HEALTH,
    queryFn: getHealth,
});

    const handleConnect = () => socketClient.connect("token-jwt-falso");

    const handleDisconnect = () => {

        socketClient.disconnect();
        room.actions.reset();
    };

    return (
        <div className="p-8 space-y-6">

            <button
                onClick={handleConnect}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Conectar
            </button>

            <button
                onClick={handleDisconnect}
                className="bg-red-600 text-white px-4 py-2 rounded"
            >
                Desconectar
            </button>

            <hr />

            <h2 className="text-2xl font-bold">
                Sala
            </h2>

            <p>
                <strong>Código:</strong> {room.code}
            </p>

            <p>
                <strong>Status:</strong> {room.status}
            </p>

            <p>
                <strong>Máximo:</strong> {room.maxPlayers}
            </p>

            <h3 className="font-bold">
                Jogadores
            </h3>

            <ul>
                {room.players.map((player) => (
                    <li key={player.id}>
                        {player.name}
                        {player.isHost && " 👑"}
                        {player.isReady && " ✅"}
                    </li>
                ))}
            </ul>

            <hr />

            <h2 className="text-2xl font-bold">
                React Query
            </h2>

            <button
                onClick={() => refetch()}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Refetch
            </button>

            {isLoading && (
                <p>Carregando...</p>
            )}

            {isFetching && (
                <p>Atualizando...</p>
            )}

           {error && (
                <pre className="text-red-500">
                    {JSON.stringify(error.message)}
                </pre>
            )}

            {data && (
                <pre className="bg-neutral-900 text-white p-4 rounded">
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </div>
    );
}
