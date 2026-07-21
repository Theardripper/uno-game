/**
 * @typedef {import('./Enums').GameStatus} GameStatus
 * @typedef {import('./Enums').EventType} EventType
 * @typedef {import('./Enums').ConnectionStatus} ConnectionStatus
 */

/**
 * @typedef {'casual' | 'ranked' | 'tournament'} GameType
 */

/**
 * @typedef {Object} Game
 * @property {string} id - Game identifier (UUID)
 * @property {string} room_id - FK -> rooms
 * @property {string | null} previous_game_id - Previous game in rematch chain (null if first)
 * @property {string | null} winner_player_id - Overall winner player (null while in_progress)
 * @property {GameStatus} status - Current or final state of the game
 * @property {GameType} game_type - Type of game
 * @property {number} total_rounds - Total rounds played
 * @property {Date} started_at - Game start date
 * @property {Date | null} finished_at - Game end date
 * @property {number | null} duration_seconds - Total duration in seconds
 */

/**
 * @typedef {Object} GameSettings
 * @property {string} game_id - FK -> games
 * @property {boolean} allow_stacking - Allow stacking +2/+4
 * @property {boolean} allow_jump_in - Allow playing identical card out of turn
 * @property {boolean} draw_until_playable - Draw until valid card found
 * @property {boolean} seven_zero_rule - 7 swaps hands, 0 rotates hands
 * @property {boolean} force_play - Force playing drawn valid card
 * @property {number} turn_time_limit_seconds - Turn time limit
 * @property {number} max_rounds - Max rounds (1 for quick match)
 * @property {number} points_to_win - Points to win (if max_rounds > 1)
 * @property {number} reconnect_grace_period_seconds - Wait time for reconnect before forfeit
 */

/**
 * @typedef {Object} Round
 * @property {string} id - Round identifier (UUID)
 * @property {string} game_id - FK -> games
 * @property {number} round_number - Sequential round number
 * @property {string | null} winner_player_id - Winner of this round (null if cancelled)
 * @property {Date} started_at - Round start date
 * @property {Date | null} finished_at - Round end date
 */

/**
 * @typedef {Object} RoundPlayer
 * @property {string} round_id - FK -> rounds
 * @property {string} player_id - FK -> players
 * @property {number} points_earned - Points earned this round
 * @property {number} cards_remaining - Cards left when round ended
 * @property {number} cards_played - Cards played this round
 * @property {number} cards_drawn - Cards drawn this round
 * @property {number} uno_calls - Successful UNO declarations this round
 * @property {number} penalties_received - Penalties received this round
 */

/**
 * @typedef {Object} GamePlayer
 * @property {string} game_id - FK -> games
 * @property {string} player_id - FK -> players
 * @property {number} turn_order - Play order in the game
 * @property {number | null} final_position - Final placement (1st, 2nd, etc)
 * @property {number} total_points - Accumulated points across rounds
 * @property {number} total_cards_played - Total cards played in game
 * @property {number} total_cards_drawn - Total cards drawn in game
 * @property {number} total_uno_calls - Total UNO declarations
 * @property {ConnectionStatus} connection_status - Final connection state
 */

/**
 * @typedef {Object} GameEvent
 * @property {string} id - Event identifier (UUID)
 * @property {string} game_id - FK -> games
 * @property {string | null} round_id - FK -> rounds (null for game-level events)
 * @property {string | null} player_id - FK -> players (null for system events)
 * @property {number} sequence_number - Deterministic sequence number inside the game
 * @property {EventType} type - Type of event
 * @property {Object} payload - Event specific data (JSON)
 * @property {Date} created_at - Occurrence time
 */

export {};
