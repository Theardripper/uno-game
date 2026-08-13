//import { registerChatHandlers } from "./chat";
import { registerGameHandlers } from "./game";
import { registerLobbyHandlers } from "./lobby";
//import { registerSystemHandlers } from "./system";

/**
 * Registra todos os handlers globais do Socket.IO.
 *
 * Cada domínio retorna uma função de cleanup.
 * O SocketProvider utiliza essa função para remover
 * todos os listeners quando for desmontado.
 *
 * @returns {Function} Cleanup
 */
export function registerSocketHandlers() {

    console.log("[Socket] Registering handlers...");

    const cleanups = [
        registerLobbyHandlers(),
        registerGameHandlers(),
    ];

    return () => cleanups.forEach((cleanup) => cleanup());

}
