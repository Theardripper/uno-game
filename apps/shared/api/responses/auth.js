/**
 * @typedef {Object} AuthResponseData
 * @property {import('../../types/Player').Player} user
 * @property {string} accessToken - JWT Bearer Token
 * @property {string} refreshToken - JWT Refresh Token
 */

/**
 * @typedef {import('./common').SuccessResponse<AuthResponseData>} AuthResponse
 */

export {};
