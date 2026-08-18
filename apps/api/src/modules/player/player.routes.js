import { extractUser } from "#middlewares/auth.middleware.js";
import { memoizationMiddleware } from "#middlewares/memoization.middleware.js";
import { Router } from "express";
import * as playerController from "./player.controller.js";

const router = Router();

// Configuração centralizada do cache para esta rota
const memoizationConfig = {
    max: 50,
    maxAge: 30000, // 30 segundos
};

router.post("/", playerController.createPlayer);
router.get("/me/stats", extractUser, playerController.getStats);
router.get("/me/history", extractUser, playerController.getHistory);
router.get("/me", extractUser, playerController.getMe);
router.patch("/me", extractUser, playerController.updateMe);
// Aplicando memoization apenas nesta rota GET para demo
router.get("/:id", memoizationMiddleware(memoizationConfig), playerController.getPlayerById);
router.put("/:id", playerController.updatePlayer);
router.delete("/:id", playerController.deletePlayer);

export { router as playerRouter };
