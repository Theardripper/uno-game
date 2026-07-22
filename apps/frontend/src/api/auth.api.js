import ky from "ky";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000";

/**
 * Cliente Ky configurado com a URL base da API.
 *
 * - prefixUrl: define a raiz das requisições (e.g., /api).
 * - timeout: tempo limite de 10s para requisições.
 * - retry: número máximo de tentativas em caso de falha.
 */
export const api = ky.create({

    prefixUrl: API_URL,
    timeout: 10000,
    retry: 0,

    headers: { Accept: "application/json" },

    hooks: {

        beforeRequest: [],
        afterResponse: [],
        beforeRetry: [],
    },

});
