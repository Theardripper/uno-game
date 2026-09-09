//@ts-check

import { success } from "#shared/helpers/response.js";
import * as authService from "./auth.service.js";
import { blacklistToken } from "./token-blacklist.js";

/**
 * Auth controller — thin HTTP layer.
 * Extracts data from request, delegates to service, formats response.
 */
/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('express').NextFunction} NextFunction */

/**
 * POST /api/auth/sign-up
 *
 * @param {import('express').Request<{}, any, SignUpRequest>} req
 * @param {NextFunction} next
 */
export async function signUp(req, res, next) {
    try {
        const { name, email, password } = req.body;

        const data = await authService.signUp(name, email, password);

        return success(res, data, "Account created successfully.", 201);
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/auth/sign-in
 *
 * @param {import('express').Request<{}, any, SignInRequest>} request
 * @param {Response} response
 * @param {NextFunction} next
 */
export async function signIn(request, response, next) {
    try {
        const { email, password } = request.body;

        const data = await authService.signIn(email, password);

        return success(response, data, "Logged successfully.");
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/auth/guest
 *
 * @param {import('express').Request<{}, any, GuestRequest>} request
 * @param {Response} response
 * @param {NextFunction} next
 */
export async function guestLogin(request, response, next) {
    try {
        const { name, avatarSeed } = request.body;

        const data = await authService.guest(name, avatarSeed);

        return success(response, data, "Guest account created.", 201);
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/auth/logout
 *
 * @param {import('express').Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function logout(req, res, next) {
    try {
        blacklistToken(req.token);
        return success(res, null, "Logout successfully.");
    } catch (err) {
        next(err);
    }
}
