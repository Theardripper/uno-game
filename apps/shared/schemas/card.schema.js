import { z } from "zod";

export const CardColorSchema = z.enum(["red", "blue", "green", "yellow", "wild"]);

export const CardValueSchema = z.enum([
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",

    "skip",
    "reverse",
    "draw_two",

    "wild",
    "wild_draw_four",
]);

export const CardSchema = z.object({
    id: z.string().uuid().optional(),
    color: CardColorSchema,
    value: CardValueSchema,
    score: z.number(),
});
