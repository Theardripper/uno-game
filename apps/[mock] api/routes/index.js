import { Router } from "express";

import authRoutes from "./auth.routes.js";
import healthRoutes from "./health.routes.js";
import playersRoutes from "./players.routes.js";
import roomsRoutes from "./rooms.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use(authRoutes);
router.use(playersRoutes);
router.use(roomsRoutes);

export default router;
