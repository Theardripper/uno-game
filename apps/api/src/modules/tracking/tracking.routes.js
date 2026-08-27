import { Router } from "express";
import { 
    getRequestStats, 
    getResponseTimeStats, 
    getStatusCodeStats, 
    getPopularEndpointsStats 
} from "./tracking.controller.js";

const router = Router();

router.get("/requests", getRequestStats);
router.get("/response-times", getResponseTimeStats);
router.get("/status-codes", getStatusCodeStats);
router.get("/popular-endpoints", getPopularEndpointsStats);

export default router;