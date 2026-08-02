"use client";

import { Toaster } from "@components/ui/toast";
import { QueryProvider } from "./query-provider";
import { SocketProvider } from "./socket-provider";
/**
 * Centraliza todos os Providers globais da aplicação.
 *
 * Conforme o projeto crescer, novos providers serão
 * adicionados aqui (Theme, QueryClient, etc.).
 */
export function AppProviders({ children }) {
    return (
        <QueryProvider>
                <SocketProvider>
                    {children}
                     <Toaster />
                </SocketProvider>
        </QueryProvider>
    );
}
