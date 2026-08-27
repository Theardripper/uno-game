import { Router } from "express";
import { getRequestStats, getResponseTimeStats } from "./tracking.controller.js";

const router = Router();

router.get("/requests", getRequestStats);
router.get("/response-times", getResponseTimeStats);

export default router;