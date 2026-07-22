import { z } from "zod";

export const PlayerStateSchema = z.enum(["connecting", "connected", "ready", "in-game", "disconnected"]);

export const PlayerSchema = z.object({
    id: z.string().uuid(),

    name: z.string(),

    avatar_seed: z.string(),

    is_guest: z.boolean(),

    is_bot: z.boolean(),

    bot_difficulty: z.enum(["easy", "medium", "hard"]).nullable(),
});
