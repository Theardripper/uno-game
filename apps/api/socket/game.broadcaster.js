import { GameEvents } from "../../shared/socket/events.js";
import { gameEngine } from "../src/modules/game/game.engine.js";

/**
 * Broadcasts the current game state to all players in the room.
 * Sends the public state to the entire room and the private hand to each individual player.
 *
 * @param {import('socket.io').Server} io
 * @param {Object} game - The game state object from GameEngine
 */
export function broadcastGameState(io, game) {
    const publicState = gameEngine.getPublicGameState(game);
    io.to(game.roomCode).emit(GameEvents.SERVER_GAME_STATE, publicState);

    for (const player of game.players) {
        if (player.isConnected) {
            io.to(`player_${player.id}`).emit(GameEvents.SERVER_HAND_UPDATED, { hand: player.hand });
        }
    }
}
