//@ts-check

import { useAppToast } from "@/hooks/use-app-toast";
import { login } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth/auth.store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useSignIn() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.actions.setAuth);
  const { success, error } = useAppToast();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      console.log(response);

      setAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      Cookies.set("accessToken", response.accessToken, { path: "/" });

      success("Login realizado com sucesso!", "Bem-vindo(a) de volta!");
      router.push("/lobby");
    },

    /** @param {any} err */
    onError: async (err) => {
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
    }
  });

  return {
    handleLogin: mutation.mutate,
    isLoading: mutation.isPending
  };
}
