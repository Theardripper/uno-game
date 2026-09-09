//@ts-check

import { api } from "@/api/client";
import { API_ROUTES } from "@shared/api/routes";

/**
 * Função para buscar o perfil do usuário logado.
 * @returns {Promise<any>}
 */
export async function getProfile() {
    return await api.get(API_ROUTES.PLAYERS.ME).json();
}

/**
 * Função para atualizar os dados do perfil do usuário logado.
 * @param {{name?: string, avatarSeed?: string, bio?: string, coverId?: number}} data 
 * @returns {Promise<any>}
 */
export async function updateProfile(data) {
    return await api.patch(API_ROUTES.PLAYERS.ME, {
        json: data,
    }).json();
}

/**
 * Função para buscar as estatísticas do usuário logado.
 * @returns {Promise<any>}
 */
export async function getProfileStats() {
    return await api.get(API_ROUTES.PLAYERS.STATS).json();
}

/**
 * Função para buscar o histórico de partidas do usuário logado.
 * @returns {Promise<any>}
 */
export async function getProfileHistory() {
    return await api.get(API_ROUTES.PLAYERS.HISTORY).json();
}
