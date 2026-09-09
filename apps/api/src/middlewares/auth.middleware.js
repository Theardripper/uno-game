import { verifyToken } from "#config/jwt.js";
import { AppError } from "#shared/errors/AppError.js";
import { isTokenBlacklisted } from "#modules/auth/token-blacklist.js";

export const extractUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Token not provided", 401, "UNAUTHORIZED");
    }

    const token = authHeader.replace("Bearer ", "");

    if (isTokenBlacklisted(token)) {
        throw new AppError("Token has been logged out", 401, "TOKEN_REVOKED");
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        throw new AppError("Invalid or expired token", 401, "INVALID_TOKEN");
    }

    req.user = decoded;
    req.token = token;
    next();
};
