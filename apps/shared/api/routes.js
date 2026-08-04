export const API_ROUTES = Object.freeze({
    AUTH: {
        SIGN_UP: "/auth/sign-up",
        SIGN_IN: "/auth/sign-in",
        GUEST: "/auth/guest",
    },
    PLAYERS: {
        ME: "/players/me",
        STATS: "/players/me/stats",
        HISTORY: "/players/me/history",
    },
    ROOMS: {
        BASE: "/rooms",
        JOIN: "/rooms/join",
        VALIDATE: (code) => `/rooms/validate/${code}`,
        GET: (code) => `/rooms/${code}`,
        BY_CODE: (/** @type {string} */ code) => `/rooms/${code}`,
        BY_ID: (/** @type {string} */ id) => `/rooms/${id}`,
    },
    GAMES: {
        BY_ID: (/** @type {string} */ id) => `/games/${id}`,
    },
    LEADERBOARD: "/leaderboard",
});
