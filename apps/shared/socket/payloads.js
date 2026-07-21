/**
 * ==========================================
 * SHARED GAME TYPES
 * ==========================================
 */

/**
 * Represents the possible colors a card can have in the game.
 * 'black' is strictly reserved for Wild and +4 cards before they are played.
 * @typedef {'red' | 'blue' | 'green' | 'yellow' | 'black'} CardColor
 */

/**
 * Represents the valid values/actions a card can hold.
 * @typedef {'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'skip' | 'reverse' | 'draw_two' | 'wild' | 'wild_four'} CardValue
 */

/**
 * Represents a single playing card instance in the game.
 * @typedef {Object} Card
 * @property {string} id - Unique identifier for the specific card instance in the deck (e.g., 'red_5_1').
 * @property {CardColor} color - The current color of the card.
 * @property {CardValue} value - The face value or action of the card.
 */

/**
 * ==========================================
 * LOBBY PAYLOADS
 * ==========================================
 */

/**
 * Sent by the client to join a specific room or reconnect to an active match.
 * @typedef {Object} JoinRoomPayload
 * @property {string} roomId - The unique code/identifier of the room to join.
 * @property {string} sessionToken - JWT token used to authenticate and identify the player.
 */

/**
 * Sent by the host to remove a specific player from the lobby.
 * @typedef {Object} KickPlayerPayload
 * @property {string} targetPlayerId - The ID of the player to be removed.
 */

/**
 * Broadcasted by the server to update the lobby status before the game starts.
 * @typedef {Object} RoomStatePayload
 * @property {Array<{id: string, name: string, isReady: boolean, isHost: boolean}>} players - List of players currently in the lobby.
 * @property {number} maxPlayers - The maximum number of players allowed in this room.
 * @property {boolean} isReadyToStart - True if all minimum requirements to start the game are met.
 */

/**
 * ==========================================
 * GAMEPLAY PAYLOADS (CLIENT ACTIONS)
 * ==========================================
 */

/**
 * Sent by the client to play a card from their hand to the discard pile.
 * @typedef {Object} PlayCardPayload
 * @property {string} cardId - The unique ID of the card being played.
 */

/**
 * Sent by the client to select a color after playing a Wild or Wild +4 card.
 * @typedef {Object} ChooseColorPayload
 * @property {CardColor} color - The chosen color for the next turn.
 */

/**
 * Sent by the client to denounce an opponent who has 1 card left but forgot to shout UNO.
 * @typedef {Object} CatchUnoPayload
 * @property {string} targetPlayerId - The ID of the player being caught.
 */

/**
 * Sent by the client to respond to a +4 card played by the previous player.
 * @typedef {Object} ChallengeDrawFourPayload
 * @property {'challenge' | 'accept'} action - 'challenge' to call a bluff, 'accept' to draw the 4 cards peacefully.
 */

/**
 * ==========================================
 * SERVER FEEDBACK PAYLOADS (STATE UPDATES)
 * ==========================================
 */

/**
 * The Single Source of Truth for the match. Broadcasted by the server whenever the state changes.
 * @typedef {Object} GameStatePayload
 * @property {string} roomId - The current room identifier.
 * @property {string} hostId - The ID of the player managing the room.
 * @property {string} state - The current phase of the match (e.g., 'player-turn', 'waiting-for-color').
 * @property {number} round - The current round number (increments after someone empties their hand).
 * @property {1 | -1} direction - The flow of the game (1 for clockwise, -1 for counter-clockwise).
 * @property {string} turnPlayerId - The ID of the player who needs to make the next move.
 * @property {string[]} turnOrder - An ordered array of player IDs representing the seating arrangement.
 * @property {Card} currentCard - The card currently sitting on top of the discard pile.
 * @property {CardColor} currentColor - The active color to be played (vital when a Wild card is on top).
 * @property {number} drawStack - The accumulated amount of cards to be drawn (used when +2 or +4 are stacked).
 * @property {number} deckCount - The number of cards remaining in the drawing deck.
 * @property {number} discardPileCount - The number of cards currently in the discard pile.
 * @property {Object<string, number>} scores - A map of player IDs to their accumulated match points.
 * @property {string} [winnerId] - The ID of the overall match winner (populated only when the match ends).
 * @property {Array<{id: string, name: string, handSize: number, hasCalledUno: boolean, state: string}>} players - The public state of all players at the table.
 * @property {Card[]} myHand - CRITICAL: The actual cards in the player's hand. The server sends this ONLY to the socket owner for security.
 */

/**
 * Semantic events broadcasted by the server to trigger UI animations and sounds.
 * @typedef {Object} GameEventPayload
 * @property {'draw' | 'play_card' | 'skip' | 'reverse' | 'draw_two' | 'wild' | 'wild_four' | 'uno_call' | 'catch_penalty' | 'color_chosen'} type - The specific action that just occurred.
 * @property {string} playerId - The ID of the player who triggered the event.
 * @property {Card} [card] - Optional. The specific card associated with the event, if applicable.
 */

/**
 * Broadcasted by the server to reveal the outcome of a +4 challenge.
 * @typedef {Object} ChallengeResultPayload
 * @property {string} challengerId - The ID of the player who issued the challenge.
 * @property {string} targetId - The ID of the player who played the +4 card.
 * @property {boolean} wasValid - True if the +4 was played legally (no matching color in hand), False if it was a bluff.
 * @property {number} penaltyAmount - The number of cards drawn as a penalty (4 for the target, 6 for the challenger).
 */

/**
 * System-wide notifications sent to clients for visual feedback (e.g., toasts).
 * @typedef {Object} NotificationPayload
 * @property {string} id - Unique ID for the notification to prevent duplicate renders on the UI.
 * @property {'success' | 'warning' | 'error' | 'info'} type - The severity or style of the notification.
 * @property {string} message - The human-readable text to display.
 * @property {number} [duration] - Optional. How long the notification should stay on screen (in milliseconds).
 */

export {}; // Ensures this file is treated as an ES Module
