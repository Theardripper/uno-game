import { env } from "#config/env.js";
import jwt from "jsonwebtoken";

/**
 * Generates a signed JWT token.
 * @param {object} payload - Data to encode in the token
 * @returns {string} Signed JWT string
 */
export const generateToken = (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

/**
 * Verifies and decodes a JWT token.
 * @param {string} token - JWT string to verify
 * @returns {object | null} Decoded payload or null if invalid/expired
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, env.JWT_SECRET);
    } catch {
        return null;
    }
};
