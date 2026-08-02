import crypto from "crypto";
import { Router } from "express";
import { API_ROUTES } from "../../shared/api/routes.js";
import { mockDB } from "../database/db.js";

const router = Router();

router.post(API_ROUTES.AUTH.SIGN_UP, (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password, // Em um sistema real, seria um hash
        isGuest: false,
    };

    mockDB.users.push(newUser);

    res.status(201).json({
        accessToken: `fake-jwt-token-for-${newUser.id}`,
        refreshToken: `fake-refresh-token-for-${newUser.id}`,
        user: {
            id: newUser.id,
            name: newUser.name,
        },
    });
});

router.post(API_ROUTES.AUTH.SIGN_IN, (req, res) => {
    const { email, password } = req.body;

    const user = mockDB.users.find((u) => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
        accessToken: `fake-jwt-token-for-${user.id}`,
        refreshToken: `fake-refresh-token-for-${user.id}`,
        user: {
            id: user.id,
            name: user.name,
        },
    });
});

router.post(API_ROUTES.AUTH.GUEST, (req, res) => {
    const { name } = req.body;

    const guestUser = {
        id: crypto.randomUUID(),
        name: name || `Guest_${Math.floor(Math.random() * 1000)}`,
        isGuest: true,
    };

    mockDB.users.push(guestUser);

    res.status(200).json({
        accessToken: `fake-jwt-token-for-${guestUser.id}`,
        refreshToken: `fake-refresh-token-for-${guestUser.id}`,
        user: {
            id: guestUser.id,
            name: guestUser.name,
        },
    });
});

export default router;
