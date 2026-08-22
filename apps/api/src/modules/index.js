import { authRouter } from "./auth/index.js";
import { cardRouter } from "./card/index.js";
import { gameRouter, gamePlayRouter } from "./game/index.js";
import { playerRouter } from "./player/index.js";
import { roomRouter } from "./room/index.js";
import { scoreRouter } from "./score/index.js";

/**
 * Registers all module routers on the Express app.
 * Each module handles its own route prefix internally.
 *
 * @param {import('express').Express} app
 */
export function registerModuleRoutes(app) {
    app.use("/api/auth", authRouter);
    app.use("/api/players", playerRouter);
    app.use("/api/games", gameRouter);
    app.use("/api/games", gamePlayRouter);
    app.use("/api/cards", cardRouter);
    app.use("/api/scores", scoreRouter);
    app.use("/api/rooms", roomRouter);
}