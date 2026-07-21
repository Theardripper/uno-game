/**
 * @typedef {Object} ApiError
 * @property {string} code - Machine-readable error identifier
 * @property {string} message - Human-readable description of the error
 */

/**
 * @template T
 * @typedef {Object} SuccessResponse
 * @property {T} data - The response payload
 * @property {string} [message] - Optional success message
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {ApiError} error - Error details
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} currentPage
 * @property {number} totalPages
 * @property {number} totalItems
 * @property {number} limit
 */

/**
 * @template T
 * @typedef {Object} PaginatedData
 * @property {T[]} items
 * @property {PaginationMeta} pagination
 */

/**
 * @template T
 * @typedef {SuccessResponse<PaginatedData<T>>} PaginatedResponse
 */

export {};
