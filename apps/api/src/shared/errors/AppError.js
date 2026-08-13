/**
 * Custom application error aligned with shared ErrorCodes.
 * Thrown by services, caught by the global error handler middleware.
 *
 * @example
 * throw new AppError('Email already registered', 409, ErrorCodes.EMAIL_ALREADY_EXISTS);
 */
export class AppError extends Error {
    /**
     * @param {string} message - Human-readable error description
     * @param {number} statusCode - HTTP status code
     * @param {string} errorCode - Machine-readable code from shared ErrorCodes
     */
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.name = "AppError";
    }
}
