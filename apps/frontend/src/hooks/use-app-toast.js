import { toast } from "@/components/ui/toast";

/**
 * Hook padronizado para exibir notificações (toasts) no aplicativo.
 * Encapsula as configurações padrão de sucesso e erro.
 */
export function useAppToast() {
  const success = (message, title = "Sucesso") => {
    toast.add({
      title,
      description: message,
      type: "success",
    });
  };

  const error = (message, title = "Erro") => {
    toast.add({
      title,
      description: message,
      type: "error",
    });
  };

  const info = (message, title = "Informação") => {
    toast.add({
      title,
      description: message,
      type: "info",
    });
  };

  const warning = (message, title = "Aviso") => {
    toast.add({
      title,
      description: message,
      type: "warning",
    });
  };

  return { success, error, info, warning };
}
