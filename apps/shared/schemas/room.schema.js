import { z } from "zod";

export const CreateRoomSchema = z.object({
    maxPlayers: z.number().int().min(2).max(10).default(4),
    isPrivate: z.boolean().default(false),
    password: z.string().optional(),
}).refine(data => {
    if (data.isPrivate && (!data.password || data.password.trim() === '')) {
        return false;
    }
    return true;
}, {
    message: "Password is required for private rooms",
    path: ["password"],
});

export const UpdateRoomSchema = z.object({
    maxPlayers: z.number().int().min(2).max(10).optional(),
    isPrivate: z.boolean().optional(),
    password: z.string().optional(),
}).refine(data => {
    if (data.isPrivate === true && (!data.password || data.password.trim() === '')) {
        return false;
    }
    return true;
}, {
    message: "Password is required for private rooms",
    path: ["password"],
});
