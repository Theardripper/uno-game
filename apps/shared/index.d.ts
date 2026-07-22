declare global {
    // ==========================================
    // 🎲 Domain Types (Models & Enums)
    // ==========================================
    type RoomStatus = import("./types/Enums.js").RoomStatus;
    type GameStatus = import("./types/Enums.js").GameStatus;
    type GameDirection = import("./types/Enums.js").GameDirection;
    type TurnPhase = import("./types/Enums.js").TurnPhase;
    type EventType = import("./types/Enums.js").EventType;
    type RoomPlayerRole = import("./types/Enums.js").RoomPlayerRole;
    type ConnectionStatus = import("./types/Enums.js").ConnectionStatus;

    type CardColor = import("./types/Card.js").CardColor;
    type CardValue = import("./types/Card.js").CardValue;
    type Card = import("./types/Card.js").Card;

    type BotDifficulty = import("./types/Player.js").BotDifficulty;
    type Player = import("./types/Player.js").Player;
    type PlayerStats = import("./types/Player.js").PlayerStats;
    type RefreshToken = import("./types/Player.js").RefreshToken;

    type Room = import("./types/Room.js").Room;
    type RoomPlayer = import("./types/Room.js").RoomPlayer;

    type GameType = import("./types/Game.js").GameType;
    type Game = import("./types/Game.js").Game;
    type GameSettings = import("./types/Game.js").GameSettings;
    type Round = import("./types/Game.js").Round;
    type RoundPlayer = import("./types/Game.js").RoundPlayer;
    type GamePlayer = import("./types/Game.js").GamePlayer;
    type GameEvent = import("./types/Game.js").GameEvent;

    // ==========================================
    // 📡 API Requests
    // ==========================================
    type SignUpRequest = import("./api/requests/auth.js").SignUpRequest;
    type SignInRequest = import("./api/requests/auth.js").SignInRequest;
    type GuestRequest = import("./api/requests/auth.js").GuestRequest;

    type UpdatePlayerProfileRequest = import("./api/requests/players.js").UpdatePlayerProfileRequest;

    // ==========================================
    // 📥 API Responses
    // ==========================================
    type ApiError = import("./api/responses/common.js").ApiError;
    type SuccessResponse = import("./api/responses/common.js").SuccessResponse;
    type ErrorResponse = import("./api/responses/common.js").ErrorResponse;
    type PaginationMeta = import("./api/responses/common.js").PaginationMeta;
    type PaginatedData = import("./api/responses/common.js").PaginatedData;
    type PaginatedResponse = import("./api/responses/common.js").PaginatedResponse;

    type AuthResponseData = import("./api/responses/auth.js").AuthResponseData;
    type AuthResponse = import("./api/responses/auth.js").AuthResponse;

    type GetPlayerProfileResponseData = import("./api/responses/players.js").GetPlayerProfileResponseData;
    type GetPlayerProfileResponse = import("./api/responses/players.js").GetPlayerProfileResponse;
    type UpdatePlayerProfileResponse = import("./api/responses/players.js").UpdatePlayerProfileResponse;
    type PlayerStatsData = import("./api/responses/players.js").PlayerStatsData;
    type GetPlayerStatsResponseData = import("./api/responses/players.js").GetPlayerStatsResponseData;
    type GetPlayerStatsResponse = import("./api/responses/players.js").GetPlayerStatsResponse;
    type GameHistoryItem = import("./api/responses/players.js").GameHistoryItem;
    type PlayerHistoryData = import("./api/responses/players.js").PlayerHistoryData;
    type GetPlayerHistoryResponse = import("./api/responses/players.js").GetPlayerHistoryResponse;

    type CreateRoomRequest = import("./api/requests/rooms.js").CreateRoomRequest;
    type UpdateRoomRequest = import("./api/requests/rooms.js").UpdateRoomRequest;

    type RoomResponseData = import("./api/responses/rooms.js").RoomResponseData;
    type CreateRoomResponse = import("./api/responses/rooms.js").CreateRoomResponse;
    type RoomValidationData = import("./api/responses/rooms.js").RoomValidationData;
    type ValidateRoomResponse = import("./api/responses/rooms.js").ValidateRoomResponse;
    type UpdateRoomResponse = import("./api/responses/rooms.js").UpdateRoomResponse;
    type LeaderboardItem = import("./api/responses/rooms.js").LeaderboardItem;
    type LeaderboardData = import("./api/responses/rooms.js").LeaderboardData;
    type LeaderboardResponse = import("./api/responses/rooms.js").LeaderboardResponse;

    type ErrorCode = import("./api/responses/errors.js").ErrorCode;

    // ==========================================
    // 🔌 Socket Payloads
    // ==========================================
    type JoinRoomPayload = import("./socket/payloads.js").JoinRoomPayload;
    type PlayCardPayload = import("./socket/payloads.js").PlayCardPayload;
    type DrawCardPayload = import("./socket/payloads.js").DrawCardPayload;
    type CallUnoPayload = import("./socket/payloads.js").CallUnoPayload;
    type RoomStatePayload = import("./socket/payloads.js").RoomStatePayload;
    type GameStatePayload = import("./socket/payloads.js").GameStatePayload;
    type NotificationPayload = import("./socket/payloads.js").NotificationPayload;
    type ErrorPayload = import("./socket/payloads.js").ErrorPayload;
}

export {};
