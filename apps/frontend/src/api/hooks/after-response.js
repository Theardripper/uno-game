import { useAuthStore } from "@store/auth/auth.store";

/**
 * Executado após toda resposta da API.
 *
 * Futuramente:
 * - Refresh Token
 * - Logout
 * - Tratamento global de erros
 *
 * @param {Object} ctx
 * @param {Request} ctx.request
 * @param {import("ky").NormalizedOptions} ctx.options
 * @param {Response} ctx.response
 */
export async function afterResponse({
    request,
    options,
    response,
}) {

    if (response.status === 401) {

        console.warn("[API] Unauthorized");

        useAuthStore
            .getState()
            .actions
            .logout();

        if (typeof window !== "undefined") {
            window.location.href = "/sign-in";
        }

    }

    return response;

}
