import { generateToken } from "#config/jwt.js";
import Player from "#modules/player/player.model.js";
import { AppError } from "#shared/errors/AppError.js";

/**
 * Auth service — business logic for authentication flows.
 * Aligned with shared/api/requests/auth.js and shared/api/responses/auth.js.
 */

/**
 * Creates a new permanent player account.
 *
 * @returns {Promise<AuthResponseData>}
 */
export async function signUp(name, email, password) {
    const existing = await Player.findOne({ email });

    if (existing) throw new AppError("Email already registered", 409, "EMAIL_ALREADY_EXISTS");

    const password_hash = await Player.hashPassword(password);

    const player = await Player.create({
        name,
        email,
        password_hash,
        is_guest: false,
    });

    const token = generateToken({ id: player._id.toString(), email: player.email });

    return {
        player: player.toPublicJSON(),
        token,
    };
}

/**
 * Authenticates an existing player by email and password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<AuthResponseData>}
 */
export async function signIn(email, password) {
    const player = await Player.findOne({ email });

    if (!player || !(await player.comparePassword(password))) {
        throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    // Update last active timestamp
    player.last_active_at = new Date();
    await player.save();

    const token = generateToken({ id: player._id.toString(), email: player.email });

    return {
        player: player.toPublicJSON(),
        token,
    };
}

/**
 * Creates a temporary guest player (no email or password).
 *
 * @param {string} name
 * @param {string} avatarSeed
 * @returns {Promise<AuthResponseData>}
 */
export async function guest(name, avatarSeed) {
    const player = await Player.create({
        name,
        email: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}@guest.local`,
        avatar_seed: avatarSeed,
        is_guest: true,
    });

    const token = generateToken({ id: player._id.toString() });

    return {
        player: player.toPublicJSON(),
        token,
    };
}
