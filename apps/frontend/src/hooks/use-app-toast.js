import { toast } from "@/components/ui/toast";
import { useCallback } from "react";

/**
 * Hook padronizado para exibir notificações (toasts) no aplicativo.
 * Encapsula as configurações padrão de sucesso e erro.
 */
export function useAppToast() {
  const success = useCallback((message, title = "Sucesso") => {
    toast.add({
      title,
      description: message,
      type: "success",
    });
  }, []);

  const error = useCallback((message, title = "Erro") => {
    toast.add({
      title,
      description: message,
      type: "error",
    });
  }, []);

  const info = useCallback((message, title = "Informação") => {
    toast.add({
      title,
      description: message,
      type: "info",
    });
  }, []);

  const warning = useCallback((message, title = "Aviso") => {
    toast.add({
      title,
      description: message,
      type: "warning",
    });
  }, []);

  return { success, error, info, warning };
}
