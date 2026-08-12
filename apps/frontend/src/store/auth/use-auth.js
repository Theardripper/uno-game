import { useShallow } from "zustand/react/shallow";

import { useAuthStore } from "./auth.store";

/**
 * Hook responsável por expor o estado de autenticação.
 *
 * A UI nunca deve conhecer diretamente o Zustand.
 */
export function useAuth() {
    return useAuthStore(
        useShallow((state) => ({
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
            isAuthenticated: state.isAuthenticated,
            user: state.user,
            actions: state.actions,
        }))
    );
}
