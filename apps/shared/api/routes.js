export const ApiRoutes = Object.freeze({
    AUTH: {
        SIGN_UP: "/api/auth/sign-up",
        SIGN_IN: "/api/auth/sign-in",
        GUEST: "/api/auth/guest",
    },
    PLAYERS: {
        ME: "/api/players/me",
        STATS: "/api/players/me/stats",
    },
    ROOMS: {
        BASE: "/api/rooms",
        BY_CODE: (/** @type {string} */ code) => `/api/rooms/${code}`, // Função útil para rotas dinâmicas!
    },
});
