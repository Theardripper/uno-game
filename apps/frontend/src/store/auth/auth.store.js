import { create } from "zustand";

/**
 * Estado inicial de Autenticação.
 *
 * Representa os tokens de acesso e refresh,
 * além do status de autenticação do usuário.
 */
import Cookies from "js-cookie";

const token = typeof window !== "undefined" ? Cookies.get("accessToken") : null;

const initialState = {
    accessToken: token || null,
    refreshToken: null,
    isAuthenticated: !!token,
};

/**
 * Store responsável pelo estado de Auth.
 *
 * Responsabilidades:
 * - Armazenar o estado atual da sessão.
 * - Expor ações para atualizar os tokens e deslogar.
 */
export const useAuthStore = create((set) => ({
    /**
     * ==========================================
     * State
     * ==========================================
     */
    ...initialState,

    /**
     * ==========================================
     * Actions
     * ==========================================
     */
    actions: {
        /**
         * Substitui completamente o estado de autenticação.
         *
         * Utilizado após o login com sucesso.
         *
         * @param {Object} auth Objeto contendo os tokens.
         */
        setAuth(auth) {
            set(() => ({
                ...initialState,
                ...auth,
                isAuthenticated: !!auth.accessToken,
            }));
        },

        /**
         * Atualiza parcialmente os tokens.
         *
         * Utilizado principalmente ao realizar o refresh do token.
         *
         * @param {Object} partialAuth Parte do estado a ser atualizada.
         */
        patchAuth(partialAuth) {
            set((state) => {
                const newState = { ...state, ...partialAuth };
                newState.isAuthenticated = !!newState.accessToken;
                return newState;
            });
        },

        /**
         * Limpa completamente o estado de autenticação.
         *
         * Utilizado durante o logout ou quando
         * o token expira e não pode ser renovado.
         */
        logout() {
            set(() => ({
                ...initialState,
            }));
        },
    },
}));
