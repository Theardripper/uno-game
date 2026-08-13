//@ts-check

import { validate } from "#middlewares/validate.middleware.js";
import { Router } from "express";
import { GuestSchema, SignInSchema, SignUpSchema } from "../../../../shared/schemas/index.js";
import * as authController from "./auth.controller.js";

const router = Router();

/**
 * Auth routes - aligned with shared/api/routes.js
 *
 * POST /api/auth/sign-up -> Create permanent account
 * POST /api/auth/sign-in -> Authenticate existing player
 * POST /api/auth/guest   -> Create temporary guest account
 */

router.post("/sign-up", validate(SignUpSchema), authController.signUp);
router.post("/sign-in", validate(SignInSchema), authController.signIn);
router.post("/guest", validate(GuestSchema), authController.guestLogin);

export default router;
