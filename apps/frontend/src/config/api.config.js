export const APP_CONFIG = {

    apiURL:
        process.env.NEXT_PUBLIC_API_URL ??
        "http://localhost:4000",

    requestTimeout: 10000,

    socket: {

        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,

        transports: [
            "websocket",
            "polling",
        ],

    },

    http: {

        retry: 0,

    },

};
