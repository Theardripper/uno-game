import { verifyToken } from "#config/jwt.js";
import { AppError } from "#shared/errors/AppError.js";

/**
 * Middleware that extracts and verifies the JWT from the Authorization header.
 * Attaches decoded user payload to req.user.
 *
 * Expected header: Authorization: Bearer <token>
 */
export const extractUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Token not provided", 401, "UNAUTHORIZED");
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);

    if (!decoded) {
        throw new AppError("Invalid or expired token", 401, "INVALID_TOKEN");
    }

    req.user = decoded;
    next();
};
