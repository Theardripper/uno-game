export const PlayerState = {
    CONNECTING: "connecting", // Establishing WebSocket connection.
    CONNECTED: "connected", // In the lobby, hasn't marked as ready.
    READY: "ready", // Marked as ready in the lobby/between rounds.
    IN_GAME: "in-game", // Actively in the match.
    DISCONNECTED: "disconnected", // Connection dropped, waiting for reconnect.
};
