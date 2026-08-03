/**
 * Middleware factory for Zod schema validation.
 * Validates req.body against a shared Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema from shared/schemas
 * @returns {import('express').RequestHandler}
 *
 * @example
 * import { SignUpSchema } from 'shared/schemas';
 * router.post('/sign-up', validate(SignUpSchema), controller.signUp);
 */
export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: {
                code: 'INVALID_PAYLOAD',
                message: 'Validation failed',
                details: result.error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            },
        });
    }

    req.body = result.data;
    next();
};
