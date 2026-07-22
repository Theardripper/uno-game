import { z } from "zod";

export const SignUpSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(100),
});

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const GuestSchema = z.object({
    name: z.string().min(2).max(100),
    avatarSeed: z.string().min(1),
});
