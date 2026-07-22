import crypto from "crypto";
import { Router } from "express";
import { API_ROUTES } from "../../shared/api/routes.js";
import { mockDB } from "../database/db.js";

const router = Router();

router.post(API_ROUTES.ROOMS.BASE, (req, res) => {
    // Generate a random 4-hex code, e.g. UNO-1A2B
    const code = `UNO-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

    const newRoom = {
        id: crypto.randomUUID(),
        code,
        hostId: "mock-host-id", // normally from JWT
        status: "waiting-for-players",
        maxPlayers: 4,
        players: [],
    };

    mockDB.rooms.push(newRoom);

    res.status(201).json(newRoom);
});

router.get(API_ROUTES.ROOMS.BASE, (req, res) => {
    res.status(200).json(mockDB.rooms);
});

router.get(API_ROUTES.ROOMS.BY_CODE(":code"), (req, res) => {
    const { code } = req.params;

    const room = mockDB.rooms.find((r) => r.code === code);

    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json(room);
});

export default router;
