import ky from "ky";
import { beforeRetry } from "./hooks/before-retry";

import { APP_CONFIG } from "@/config/api.config";
import { afterResponse } from "./hooks/after-response";
import { beforeRequest } from "./hooks/before-request";

/**
 * Cliente Ky configurado com:
 *
 * - prefixUrl global (http://localhost:4000/api)
 * - hooks configurados
 * - retry = 0 (será tratado via socket)
 */
export const api = ky.create({
    prefix: `${APP_CONFIG.apiURL}/api`,
    timeout: APP_CONFIG.requestTimeout,
    retry: APP_CONFIG.http.retry,

    headers: { Accept: "application/json" },

    hooks: {
        beforeRequest: [beforeRequest],
        afterResponse: [afterResponse],
        beforeRetry: [beforeRetry],
    },

});
