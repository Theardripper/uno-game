/**
 * Executado antes de uma tentativa de retry.
 *
 * Futuramente será utilizado para:
 * - renovar Access Token
 * - atualizar Authorization
 */
export async function beforeRetry({
    request,
    options,
    error,
    retryCount,
}) {

    console.warn(
        `[API] Retry #${retryCount}`,
        error
    );

}
