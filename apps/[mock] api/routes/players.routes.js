import { Router } from "express";
import { API_ROUTES } from "../../shared/api/routes.js";
import { mockDB } from "../database/db.js";

const router = Router();

router.get(API_ROUTES.PLAYERS.ME, (req, res) => {
    // In a real app, the user ID comes from the JWT token via middleware
    // Here we just return the first user or a mock if none exists
    const user = mockDB.users[0] || {
        id: "mock-id",
        name: "Mock User",
        isGuest: false,
    };

    res.status(200).json(user);
});

router.get(API_ROUTES.PLAYERS.STATS, (req, res) => {
    res.status(200).json({
        gamesPlayed: 10,
        gamesWon: 3,
        winRate: "30%",
    });
});

export default router;
