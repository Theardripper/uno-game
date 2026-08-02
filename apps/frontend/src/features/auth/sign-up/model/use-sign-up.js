import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/auth.store";
import { useAppToast } from "@/hooks/use-app-toast";
import { register } from "@/services/auth.service";

export function useSignUp() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.actions.setAuth);
  const { success, error } = useAppToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data) => {
    try {
      setIsLoading(true);
      const response = await register(data);

      setAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      success("Sua conta foi criada com sucesso!", "Bem-vindo(a)!");
      router.push("/lobby");
    } catch (err) {
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
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading };
}
