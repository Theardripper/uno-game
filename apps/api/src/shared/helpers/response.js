/**
 * Sends a standardized success response.
 * Envelope: { data: T, message?: string }
 *
 * @param {import('express').Response} res
 * @param {object} data - The response payload
 * @param {string} [message] - Optional success message
 * @param {number} [statusCode=200] - HTTP status code
 */
export function success(res, data, message, statusCode = 200) {
    const body = { data };
    if (message) body.message = message;
    return res.status(statusCode).json(body);
}

/**
 * Sends a standardized error response.
 * Envelope: { error: { code: string, message: string } }
 *
 * @param {import('express').Response} res
 * @param {string} code - Machine-readable error code (from shared ErrorCodes)
 * @param {string} message - Human-readable error description
 * @param {number} [statusCode=400] - HTTP status code
 */
export function error(res, code, message, statusCode = 400) {
    return res.status(statusCode).json({
        error: { code, message },
    });
}
