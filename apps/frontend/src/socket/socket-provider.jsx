"use client";

import { useEffect } from "react";

import { registerSocketHandlers } from "./handlers";

/**
 * SocketProvider
 *
 * Responsável por inicializar toda a infraestrutura
 * do Socket.IO na aplicação.
 *
 * Responsabilidades:
 *
 * - Registrar os handlers globais.
 * - Remover todos os listeners quando desmontar.
 * - Futuramente:
 *      • conectar quando houver autenticação
 *      • desconectar no logout
 *      • controlar reconexão
 *
 * IMPORTANTE:
 *
 * Este Provider NÃO conhece regras do jogo.
 * Ele apenas inicializa a camada Socket.
 */
export function SocketProvider({ children }) {
    useEffect(() => {

            console.log("[SocketProvider] Mounted");


        /* Registra todos os listeners globais. */
        const unregister = registerSocketHandlers();

        /* Cleanup. */
        return () => {

            console.log("[SocketProvider] Unmounting...");
            unregister();
        };
    }, []);

    return children;
}
