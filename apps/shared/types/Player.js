/**
 * @typedef {'easy' | 'medium' | 'hard' | null} BotDifficulty
 */

/**
 * @typedef {Object} Player
 * @property {string} id - Unique identifier of the player (UUID)
 * @property {string} name - Display name of the player
 * @property {string | null} email - Email for login (null for guests)
 * @property {string | null} password_hash - Encrypted password (null for guests)
 * @property {string} avatar_seed - Seed used to generate the avatar deterministically
 * @property {boolean} is_guest - Indicates if the player is a guest
 * @property {boolean} is_bot - Indicates if the player is an AI bot
 * @property {BotDifficulty} bot_difficulty - Bot difficulty level ('easy', 'medium', 'hard', or null)
 * @property {Date | null} last_active_at - Last activity timestamp
 * @property {Date} created_at - Account creation date
 * @property {Date} updated_at - Last update date
 * @property {Date | null} deleted_at - Soft delete date
 */

/**
 * @typedef {Object} PlayerStats
 * @property {string} player_id - FK -> players (1:1 relation)
 * @property {number} total_games - Total games played
 * @property {number} total_wins - Total wins
 * @property {number} total_losses - Total losses
 * @property {number} win_rate - Win percentage (0 to 100)
 * @property {number} total_cards_played - Total cards played in career
 * @property {number} total_cards_drawn - Total cards drawn in career
 * @property {number} total_uno_calls - Total successful UNO calls
 * @property {number} current_win_streak - Current win streak
 * @property {number} best_win_streak - Highest win streak
 * @property {number} rating - ELO/Glicko-2 rating for future matchmaking
 * @property {Date} updated_at - Last update of the stats
 */

/**
 * @typedef {Object} RefreshToken
 * @property {string} id - Unique identifier of the token (UUID)
 * @property {string} player_id - FK -> players
 * @property {string} token_hash - SHA-256 hash of the Refresh Token
 * @property {Date} expires_at - Expiration date of the Refresh Token
 * @property {Date | null} revoked_at - Revocation date (null = active)
 * @property {string | null} replaced_by_token_id - ID of the token that replaced this one
 * @property {string | null} user_agent - User-Agent of the device
 * @property {string | null} ip_address - IP address of the device
 * @property {Date} created_at - Token creation date
 */

export {};
