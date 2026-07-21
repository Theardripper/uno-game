/**
 * @typedef {Object} GetPlayerProfileResponseData
 * @property {import('../../types/Player').Player} player
 */

/**
 * @typedef {import('./common').SuccessResponse<GetPlayerProfileResponseData>} GetPlayerProfileResponse
 */

/**
 * @typedef {import('./common').SuccessResponse<GetPlayerProfileResponseData>} UpdatePlayerProfileResponse
 */

/**
 * @typedef {Object} PlayerStatsData
 * @property {number} totalMatches
 * @property {number} wins
 * @property {number} winRate
 * @property {number} totalCardsPlayed
 * @property {number} totalCardsDrawn
 * @property {number} timesShoutedUno
 */

/**
 * @typedef {Object} GetPlayerStatsResponseData
 * @property {PlayerStatsData} stats
 */

/**
 * @typedef {import('./common').SuccessResponse<GetPlayerStatsResponseData>} GetPlayerStatsResponse
 */

/**
 * @typedef {Object} GameHistoryItem
 * @property {string} gameId
 * @property {string} roomCode
 * @property {string} startedAt - ISO Date string
 * @property {number} durationSeconds
 * @property {number} finalPosition
 * @property {number} points
 * @property {string} direction - 'clockwise' or 'counter_clockwise'
 * @property {string} lastCardPlayed
 */

/**
 * @typedef {Object} PlayerHistoryData
 * @property {GameHistoryItem[]} games
 * @property {import('./common').PaginationMeta} pagination
 */

/**
 * @typedef {import('./common').SuccessResponse<PlayerHistoryData>} GetPlayerHistoryResponse
 */

export {};
