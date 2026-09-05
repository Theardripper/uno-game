import { AppError } from '#shared/errors/AppError.js';
import { logger } from '#shared/logger/logger.js';

/**
 * Global error handler middleware.
 * Must be registered LAST in the Express middleware chain.
 *
 * - AppError → returns structured error with the correct status code
 * - Unknown errors → returns 500 without leaking internal details
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    // Known business/application errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: {
                code: err.errorCode,
                message: err.message,
            },
        });
    }

    // Mongoose duplicate key error
    if (err.name === 'MongoServerError' && err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || 'field';
        return res.status(409).json({
            error: {
                code: 'DUPLICATE_ENTRY',
                message: `The value for '${field}' already exists`,
            },
        });
    }

    if (err.name === 'ValidationError') {
  return res.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message: Object.values(err.errors).map(e => e.message).join(', '),
    },
  });
}

    // Unexpected errors — never expose internals
    logger.error('Unhandled error', { error: err });
    return res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
        },
    });
};