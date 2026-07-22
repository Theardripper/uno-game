/**
 * @typedef {Object} RoomResponseData
 * @property {import('../../types/Room').Room} room
 */

/**
 * @typedef {import('./common').SuccessResponse<RoomResponseData>} CreateRoomResponse
 */

/**
 * @typedef {Object} RoomValidationData
 * @property {import('../../types/Room').Room} room
 * @property {boolean} canJoin
 */

/**
 * @typedef {import('./common').SuccessResponse<RoomValidationData>} ValidateRoomResponse
 */

/**
 * @typedef {import('./common').SuccessResponse<RoomResponseData>} UpdateRoomResponse
 */

/**
 * @typedef {Object} LeaderboardItem
 * @property {number} rank
 * @property {string} playerId
 * @property {string} name
 * @property {string} avatarUrl
 * @property {number} totalWins
 * @property {number} winRate
 */

/**
 * @typedef {Object} LeaderboardData
 * @property {LeaderboardItem[]} leaderboard
 */

/**
 * @typedef {import('./common').SuccessResponse<LeaderboardData>} LeaderboardResponse
 */

export {};
