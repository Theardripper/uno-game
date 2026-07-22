/**
 * @typedef {Object} JoinRoomPayload
 * @property {string} roomCode
 * @property {string} [token] - Optional authentication or guest token
 */

/**
 * @typedef {Object} PlayCardPayload
 * @property {string} cardId
 * @property {string} [color] - Only required if the card is a Wild or Wild+4
 */

/**
 * @typedef {Object} DrawCardPayload
 */

/**
 * @typedef {Object} CallUnoPayload
 */

/**
 * @typedef {Object} RoomStatePayload
 * @property {import('../types/Room').Room} room
 * @property {import('../types/Room').RoomPlayer[]} players
 */

/**
 * @typedef {Object} GameStatePayload
 * @property {import('../types/Game').Game} game
 * @property {import('../types/Game').GamePlayer[]} players
 * @property {import('../types/Game').Round} currentRound
 * @property {import('../types/Game').RoundPlayer[]} roundPlayers
 * @property {import('../types/Card').Card} topCard
 * @property {string} activePlayerId
 */

/**
 * @typedef {Object} NotificationPayload
 * @property {'info' | 'warning' | 'success' | 'error'} type
 * @property {string} message
 */

/**
 * @typedef {Object} ErrorPayload
 * @property {import('../api/responses/errors').ErrorCode} code
 * @property {string} message
 */

export { };
