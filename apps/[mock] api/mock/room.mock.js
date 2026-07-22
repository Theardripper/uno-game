export default {
    id: "room-123",

    code: "UNO-A1B2",

    hostId: "player-1",

    status: "waiting-for-players",

    maxPlayers: 4,

    players: [
        {
            id: "player-1",
            name: "Player 1",
            isReady: true,
            isHost: true,
        },
        {
            id: "player-2",
            name: "Player 2",
            isReady: false,
            isHost: false,
        },
        {
            id: "player-3",
            username: "Player 3",
            isReady: false,
            isHost: false,
        },
        {
            id: "player-4",
            username: "Player 4",
            isReady: false,
            isHost: false,
        },
    ],
};
