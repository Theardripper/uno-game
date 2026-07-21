export const SystemEvents = {
    // Direct responses to the client that emitted an invalid action
    SERVER_ERROR: "server:error",

    // System-wide visual feedback (e.g., toast notifications for warnings or info)
    SERVER_NOTIFICATION: "server:notification",
};

export const LobbyEvents = {
    // ==========================================
    // ⬆️ Client Actions
    // ==========================================

    // Handles initial room entry AND reconnection using a session token
    CLIENT_JOIN_ROOM: "client:join-room",

    // Player voluntarily leaves the lobby or match
    CLIENT_LEAVE_ROOM: "client:leave-room",

    // Player toggles their "Ready" status before the host starts the game
    CLIENT_TOGGLE_READY: "client:toggle-ready",

    // Host initiates the match, moving the state from lobby to dealing cards
    CLIENT_START_GAME: "client:start-game",

    // Host removes a specific player from the lobby
    CLIENT_KICK_PLAYER: "client:kick-player",

    // ==========================================
    // ⬇️ Server Updates
    // ==========================================

    // Complete snapshot of the current lobby state (players, ready status, etc.)
    SERVER_ROOM_STATE: "server:room-state",

    // Broadcasted when a new player connects (useful for UI entry animations)
    SERVER_PLAYER_JOINED: "server:player-joined",

    // Broadcasted when a player drops or leaves (useful for UI exit animations)
    SERVER_PLAYER_LEFT: "server:player-left",
};

export const GameEvents = {
    // ==========================================
    // ⬆️ Client Actions
    // ==========================================

    // Player attempts to play a card from their hand
    CLIENT_PLAY_CARD: "client:play-card",

    // Player draws a card from the deck
    CLIENT_DRAW_CARD: "client:draw-card",

    // Player passes their turn (only valid if they just drew a card and chose not to play it)
    CLIENT_PASS_TURN: "client:pass-turn",

    // Player selects a color after playing a Wild or +4 card
    CLIENT_CHOOSE_COLOR: "client:choose-color",

    // Player shouts UNO! (must be emitted right before or alongside playing their penultimate card)
    CLIENT_CALL_UNO: "client:call-uno",

    // Player denounces an opponent who forgot to call UNO
    CLIENT_CATCH_UNO: "client:catch-uno",

    // Player challenges or accepts a +4 card played by the previous player
    CLIENT_CHALLENGE_DRAW_FOUR: "client:challenge-draw-four",

    // Player confirms they are ready to proceed to the next round after reviewing the scoreboard
    CLIENT_READY_NEXT_ROUND: "client:ready-next-round",

    // Player requests to play another match with the same room after the game finishes
    CLIENT_REQUEST_REMATCH: "client:request-rematch",

    // ==========================================
    // ⬇️ Server Updates
    // ==========================================

    // The Single Source of Truth snapshot. Contains the entire game state, with the hand filtered securely
    SERVER_GAME_STATE: "server:game-state",

    // Semantic events for UI feedback, sounds, and visual effects (e.g., 'reverse', 'skip')
    SERVER_GAME_EVENT: "server:game-event",

    // Broadcasts the outcome of a +4 challenge and applies penalties
    SERVER_CHALLENGE_RESULT: "server:challenge-result",
};

export const ChatEvents = {
    // Player sends a text message to the room
    CLIENT_SEND_MESSAGE: "client:send-message",

    // Server broadcasts a chat message to all players in the room with a timestamp
    SERVER_CHAT_MESSAGE: "server:chat-message",
};

// Main exporter aggregating all domains
export const SocketEvents = {
    ...SystemEvents,
    ...LobbyEvents,
    ...GameEvents,
    ...ChatEvents,
};
