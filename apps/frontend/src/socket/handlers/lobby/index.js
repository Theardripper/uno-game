import { registerRoomStateHandler } from "./room-state.handler";

/** Registra todos os handlers relacionados ao Lobby. */
export function registerLobbyHandlers() {

    console.log("[Socket] Registering lobby handlers...");

    const cleanups = [
        registerRoomStateHandler(),
    ];

    return () => cleanups.forEach((cleanup) => cleanup());
}
