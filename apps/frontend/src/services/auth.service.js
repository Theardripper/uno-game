//@ts-check

import { api } from "@/api/client";
import { API_ROUTES } from "@shared/api/routes";

/** @param {SignInRequest} body **/
export async function login(body){

    const path = API_ROUTES.AUTH.SIGN_IN;

    return api
        .post(path,{ json:body })
        .json()
    ;
}
