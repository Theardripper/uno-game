//@ts-check

import { api } from "@/api/client";
import { API_ROUTES } from "@shared/api/routes";

/**
 * @param {SignInRequest} body
 * @returns {Promise<AuthResponseData>}
 * **/
export async function login(body){

    const path = API_ROUTES.AUTH.SIGN_IN;

    return api
        .post(path,{ json:body })
        .json()
    ;
}

/**
 * Função para registrar um novo usuário (Sign Up).
 *
 * @param {SignUpRequest} data
 * @returns {Promise<AuthResponseData>}
 */
export async function register(data) {
  return await api
    .post(API_ROUTES.AUTH.SIGN_UP, {
      json: data,
    })
    .json();
}
