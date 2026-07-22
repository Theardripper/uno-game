export const API_ROUTES = Object.freeze({
    AUTH: {
        SIGN_UP: "/api/auth/sign-up",
        SIGN_IN: "/api/auth/sign-in",
        GUEST: "/api/auth/guest",
    },
    PLAYERS: {
        ME: "/api/players/me",
        STATS: "/api/players/me/stats",
        HISTORY: "/api/players/me/history",
    },
    ROOMS: {
        BASE: "/api/rooms",
        BY_CODE: (/** @type {string} */ code) => `/api/rooms/${code}`,
        BY_ID: (/** @type {string} */ id) => `/api/rooms/${id}`,
    },
    GAMES: {
        BY_ID: (/** @type {string} */ id) => `/api/games/${id}`,
    },
    LEADERBOARD: "/api/leaderboard",
});
