"use client";

import { SocketProvider } from "@socket/socket-provider";

/**
 * Centraliza todos os Providers globais da aplicação.
 *
 * Conforme o projeto crescer, novos providers serão
 * adicionados aqui (Theme, QueryClient, etc.).
 */
export function AppProviders({ children }) {
    return (
        <SocketProvider>
            {children}
        </SocketProvider>
    );
}
