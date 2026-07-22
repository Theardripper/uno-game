"use client";

import { socketClient } from "@socket/socket-client";

import { useRoom } from "@/store/room/use-room";

export default function Page() {

    const room = useRoom();

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
        </div>
    );
}
