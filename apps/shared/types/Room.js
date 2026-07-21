/**
 * @typedef {import('./Enums').RoomStatus} RoomStatus
 * @typedef {import('./Enums').RoomPlayerRole} RoomPlayerRole
 * @typedef {import('./Enums').ConnectionStatus} ConnectionStatus
 */

/**
 * @typedef {Object} Room
 * @property {string} id - Internal room identifier (UUID)
 * @property {string} code - Shareable room code (e.g., UNO-A1B2)
 * @property {string} host_id - FK -> players, Player who is the Host
 * @property {number} min_players - Minimum players to start
 * @property {number} max_players - Maximum players allowed
 * @property {boolean} is_private - Indicates if the room is private
 * @property {string | null} password_hash - Encrypted password for private rooms
 * @property {RoomStatus} status - Current room state
 * @property {Date} created_at - Creation date
 * @property {Date} updated_at - Last update date
 */

/**
 * @typedef {Object} RoomPlayer
 * @property {string} room_id - FK -> rooms
 * @property {string} player_id - FK -> players
 * @property {RoomPlayerRole} role - Active player or spectator
 * @property {boolean} is_ready - True if ready to start
 * @property {ConnectionStatus} connection_status - WebSocket connection state
 * @property {Date} joined_at - Moment the player joined the room
 */

export {};
