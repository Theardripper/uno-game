import { useAuth } from "@/store/auth/use-auth";

/**
 * Hook para obter os dados do usuário atualmente autenticado.
 * Deriva os dados diretamente do token decodificado na store.
 */
export function useCurrentUser() {
    const { user, isAuthenticated, accessToken } = useAuth();
    
    return {
        user,
        playerId: user?.id || user?.sub,
        isAuthenticated,
        accessToken,
    };
}
