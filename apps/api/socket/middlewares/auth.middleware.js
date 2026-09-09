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
import mongoose from "mongoose";
import Player from "#modules/player/player.model.js";

export async function authMiddleware(socket, next) {
    const auth = socket.handshake.auth || {};
    const query = socket.handshake.query || {};
    const headers = socket.handshake.headers || {};

    const authHeader = headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

    const token = auth.token || query.token || bearerToken || headers.token;
    const playerId = auth.playerId || query.playerId || headers["x-player-id"];
    const name = auth.name || query.name;

    if (!token) {
        const error = new Error("token de autenticação ausente");
        error.data = { code: ErrorCodes.INVALID_TOKEN };
        return next(error);
    }

    let realName = name;
    let realAvatarSeed = undefined;
    let realLevel = 1;
    if (playerId && mongoose.isValidObjectId(playerId)) {
        try {
            const playerDoc = await Player.findById(playerId);
            if (playerDoc) {
                realName = playerDoc.name;
                realAvatarSeed = playerDoc.avatar_seed;
                realLevel = playerDoc.level;
            }
        } catch (err) {
            console.error("Socket Auth Error:", err);
        }
    }

    /**
     * Identidade do player usada por todos os handlers.
     */
    socket.data.player = {
        id: playerId || socket.id,
        name: realName || `Player-${socket.id.slice(0, 5)}`,
        avatarSeed: realAvatarSeed ? `https://api.dicebear.com/9.x/bottts/svg?seed=${realAvatarSeed}` : undefined,
        level: realLevel,
    };

    return next();
}
