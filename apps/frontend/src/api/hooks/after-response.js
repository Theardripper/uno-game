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

    // Ignorar 401 em rotas de login/registro, senão a página recarrega em vez de exibir erro
    const isAuthRoute = request.url.includes('/auth/sign-in') || request.url.includes('/auth/sign-up');

    if (response.status === 401 && !isAuthRoute) {

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
