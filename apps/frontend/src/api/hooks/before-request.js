import { useAuthStore } from "@store/auth/auth.store";

/**
 * Executado imediatamente antes de qualquer requisição.
 *
 * Responsabilidades:
 * - Injetar o Access Token.
 * - Adicionar headers globais.
 * - Adicionar metadados da aplicação.
 *
 * @param {Object} ctx
 * @param {Request} ctx.request
 * @param {import("ky").NormalizedOptions} ctx.options
 */
export async function beforeRequest({ request, options }) {

    const token = useAuthStore.getState().accessToken;

    request.headers.set("Accept", "application/json");

    if (token) {
        request.headers.set(
            "Authorization",
            `Bearer ${token}`
        );
    }

}
