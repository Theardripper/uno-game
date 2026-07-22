/**
 * @typedef {Object} CreateRoomRequest
 * @property {number} maxPlayers - Maximum number of players allowed (e.g., 2 to 4)
 * @property {boolean} isPrivate - Indicates if the room requires a password
 * @property {string} [password] - Required only if isPrivate is true
 */

/**
 * @typedef {Object} UpdateRoomRequest
 * @property {number} [maxPlayers]
 * @property {boolean} [isPrivate]
 * @property {string} [password]
 */

export {};
