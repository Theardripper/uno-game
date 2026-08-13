import bcrypt from "bcryptjs";
import mongoose from "mongoose";

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
            enum: ["easy", "medium", "hard", null],
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
        cover_id: {
            type: Number,
            default: 1,
            enum: [1, 2, 3, 4],
        },
        bio: {
            type: String,
            default: "",
            maxlength: 120,
        },
        stats: {
            wins: { type: Number, default: 0 },
            losses: { type: Number, default: 0 },
            gamesPlayed: { type: Number, default: 0 },
        },
        xp: {
            type: Number,
            default: 0,
        },
        tag: {
            type: String,
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

playerSchema.pre("save", function () {
    if (!this.tag) {
        this.tag = `#${Math.floor(1000 + Math.random() * 9000)}`;
    }
});

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
    // Import dynamically or calculate here? Actually, the progression util is in shared.
    // However, Mongoose models don't easily do dynamic ESM imports if not async.
    // It's better to just calculate level using the same logic or import the util.
    const getLevelProgress = (totalXp) => {
        const level = totalXp <= 0 ? 1 : Math.floor(Math.sqrt(totalXp / 100)) + 1;
        const levelStartTotalXp = 100 * Math.pow(level - 1, 2);
        const nextLevelTotalXp = 100 * Math.pow(level, 2);
        const currentLevelXp = totalXp - levelStartTotalXp;
        const levelSize = nextLevelTotalXp - levelStartTotalXp;
        const xpToNextLevel = nextLevelTotalXp - totalXp;
        const progressPercentage = Math.floor((currentLevelXp / levelSize) * 100);
        return { level, totalXp, currentLevelXp, nextLevelXp: nextLevelTotalXp, xpToNextLevel, progressPercentage };
    };

    const progress = getLevelProgress(this.xp);

    return {
        id: this._id.toString(),
        name: this.name,
        tag: this.tag,
        email: this.email,
        avatarSeed: this.avatar_seed,
        avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${this.avatar_seed}`,
        coverId: this.cover_id,
        bio: this.bio,
        level: progress.level,
        xp: this.xp,
        currentLevelXp: progress.currentLevelXp,
        nextLevelXp: progress.nextLevelXp,
        xpToNextLevel: progress.xpToNextLevel,
        progressPercentage: progress.progressPercentage,
        stats: this.stats,
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

const Player = mongoose.model("Player", playerSchema);

export default Player;
