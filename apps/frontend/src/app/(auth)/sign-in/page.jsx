"use client"

import { connectSocket, disconnectSocket, socket } from "@socket/socket-client";
import { useEffect, useState } from "react";

export default function Page() {
    const [lastResponse, setLastResponse] = useState(null);

    useEffect(() => {
        const handleRoomState = (data, callback) => {
            console.log("[Page] ROOM STATE:", data);
            callback();
        };

        const handleNotification = (data, callback) => {
            console.log("[Page] NOTIFICATION:", data);
            callback();
        };

        socket.on("server:room-state", handleRoomState);
        socket.on("server:notification", handleNotification);

        return () => {
            socket.off("server:room-state", handleRoomState);
            socket.off("server:notification", handleNotification);
        };
    }, []);

    const handleConnectTest = () => {
        connectSocket('token-jwt-falso-123');
    }

const handlePlayCardTest = () => {
    console.log("[Page] PlayCard", {
        connected: socket.connected,
        active: socket.active,
        id: socket.id,
    });

    socket.emit("client:play-card", {
        cardId: "red_5",
    }, (response) => {
        console.log("Resposta do backend:", response);
        setLastResponse(response);
    });
};

    return (
        <div className="p-10 flex flex-col gap-4">
            <button onClick={handleConnectTest} className="bg-blue-500 text-white p-2 cursor-pointer">
                Testar o Connect
            </button>
            <button onClick={handlePlayCardTest} className="bg-green-500 text-white p-2 cursor-pointer">
                Testar o Play Card
            </button>
            <button onClick={disconnectSocket} className="bg-red-500 text-white p-2 cursor-pointer">
                Testar o Disconnect
            </button>

            {lastResponse && (
                <div className="mt-4 p-4 bg-gray-800 text-white rounded">
                    <h3 className="font-bold">Última Resposta do Backend:</h3>
                    <pre className="mt-2 text-sm">{JSON.stringify(lastResponse, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
