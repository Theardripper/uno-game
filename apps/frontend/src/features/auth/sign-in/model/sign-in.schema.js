import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "O e-mail é obrigatório." })
    .email({ message: "Informe um e-mail válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});
