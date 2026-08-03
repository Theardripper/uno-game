import { ErrorCodes } from "../../../shared/api/responses/errors.js";

/**
 * Middleware de autenticação do handshake.
 *
 * O frontend envia o token em:
 * socket.handshake.auth.token
 * (ver apps/frontend/src/socket/socket-client.js)
 *
 * Por enquanto o token não é validado de verdade porque a US de
 * autenticação JWT ainda não foi integrada na API. Quando o JWT
 * estiver pronto, basta trocar a extração abaixo pela verificação
 * real (jwt.verify) e preencher socket.data.player com o payload.
 *
 * @param {import('socket.io').Socket} socket
 * @param {Function} next
 */
export function authMiddleware(socket, next) {
    const { token, playerId, name } = socket.handshake.auth || {};

    if (!token) {
        const error = new Error("token de autenticação ausente");
        error.data = { code: ErrorCodes.INVALID_TOKEN };
        return next(error);
    }

    /**
     * Identidade do player usada por todos os handlers.
     *
     * TODO(auth): extrair id e nome do JWT quando a validação real existir.
     */
    socket.data.player = {
        id: playerId || socket.id,
        name: name || `Player-${socket.id.slice(0, 5)}`,
    };

    return next();
}
