//@ts-check

import { useAppToast } from "@/hooks/use-app-toast";
import { register } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth/auth.store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useSignUp() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.actions.setAuth);
  const { success, error } = useAppToast();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      setAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      success("Sua conta foi criada com sucesso!", "Bem-vindo(a)!");
      router.push("/lobby");
    },

    /** @param {any} err */
    onError: async (err) => {
      console.error(err);
      let errorMessage = "Ocorreu um erro ao tentar criar sua conta. Tente novamente mais tarde.";

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
    handleRegister: mutation.mutate,
    isLoading: mutation.isPending
  };
}
