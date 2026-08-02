//@ts-check

import { useAppToast } from "@/hooks/use-app-toast";
import { login } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useSignIn() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.actions.setAuth);
  const { success, error } = useAppToast();
  const [isLoading, setIsLoading] = useState(false);


  /**
   * @param {SignInRequest} data
   */
  const handleLogin = async (data) => {

    try {
      setIsLoading(true);
      const response = await login(data);

      console.log(response);

      setAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      success("Login realizado com sucesso!", "Bem-vindo(a) de volta!");
      router.push("/lobby");
    } catch (err) {
      console.error(err);
      let errorMessage = "Ocorreu um erro ao tentar fazer login. Verifique suas credenciais.";

      try {
        if (err.response) {
            const errorData = await err.response.json();
            if (errorData?.error) {
                errorMessage = errorData.error;
            }
        }
      } catch (e) {
        // Ignora erro no parse
      }

      error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
}
