export const GameState = {
    WAITING_FOR_PLAYERS: "waiting-for-players", // Lobby phase: waiting for minimum players.
    STARTING: "starting", // Host initiated: initializing rules and validating players.
    DEALING_CARDS: "dealing-cards", // Shuffling deck and distributing initial cards.
    PLAYER_TURN: "player-turn", // Normal gameplay phase.
    WAITING_FOR_COLOR: "waiting-for-color", // Paused: waiting for a player to pick a color.
    WAITING_FOR_CHALLENGE: "waiting-for-challenge", // Paused: next player deciding to challenge a +4.
    ROUND_FINISHED: "round-finished", // Round over: showing scoreboard. Waiting for players to ready up for next round.
    GAME_FINISHED: "game-finished", // Match over: showing final podium/winner.
    RESTARTING: "restarting", // Transition phase after a Rematch is accepted.
    CANCELLED: "cancelled", // Match aborted.
    PAUSED: "paused", // System pause (e.g., waiting for someone to reconnect).
};
