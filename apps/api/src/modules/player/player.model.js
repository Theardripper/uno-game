import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Player model — unified entity (replaces old User.js and Player.js).
 * Aligned with shared/types/Player.js and shared/docs/db-mer.md.
 */
const playerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple nulls (for guests)
            trim: true,
            lowercase: true,
            default: null,
        },
        password_hash: {
            type: String,
            default: null,
        },
        avatar_seed: {
            type: String,
            required: true,
            default: () => crypto.randomUUID(),
        },
        is_guest: {
            type: Boolean,
            required: true,
            default: false,
        },
        is_bot: {
            type: Boolean,
            required: true,
            default: false,
        },
        bot_difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard', null],
            default: null,
        },
        last_active_at: {
            type: Date,
            default: null,
        },
        deleted_at: {
            type: Date,
            default: null,
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// ─── Static Methods ──────────────────────────────────────

/**
 * Hashes a plain-text password.
 * @param {string} password
 * @returns {Promise<string>} bcrypt hash
 */
playerSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// ─── Instance Methods ────────────────────────────────────

/**
 * Compares a plain-text password with the stored hash.
 * @param {string} enteredPassword
 * @returns {Promise<boolean>}
 */
playerSchema.methods.comparePassword = async function (enteredPassword) {
    if (!this.password_hash) return false;
    return bcrypt.compare(enteredPassword, this.password_hash);
};

/**
 * Returns a public representation of the player.
 * Strips sensitive fields (password_hash, deleted_at, __v).
 * @returns {object}
 */
playerSchema.methods.toPublicJSON = function () {
    return {
        id: this._id.toString(),
        name: this.name,
        email: this.email,
        avatarSeed: this.avatar_seed,
        isGuest: this.is_guest,
        isBot: this.is_bot,
    };
};

// ─── Query Helpers ───────────────────────────────────────

/**
 * Default filter: exclude soft-deleted players.
 */
playerSchema.pre(/^find/, function () {
    if (!this.getQuery().include_deleted) {
        this.where({ deleted_at: null });
    }
});

const Player = mongoose.model('Player', playerSchema);

export default Player;
