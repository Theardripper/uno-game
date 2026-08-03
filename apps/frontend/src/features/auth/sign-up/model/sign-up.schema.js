import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "O username é obrigatório." })
      .min(2, { message: "O username deve ter no mínimo 2 caracteres." })
      .max(100, { message: "O username não pode exceder 100 caracteres." }),
    email: z
      .string()
      .min(1, { message: "O e-mail é obrigatório." })
      .email({ message: "Informe um e-mail válido." }),
    password: z
      .string()
      .min(1, { message: "A senha é obrigatória." })
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
      .max(100, { message: "A senha não pode exceder 100 caracteres." }),
    confirmPassword: z
      .string()
      .min(1, { message: "A confirmação de senha é obrigatória." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem. Por favor, verifique.",
    path: ["confirmPassword"],
  });
