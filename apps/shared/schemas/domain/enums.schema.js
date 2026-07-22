import { z } from "zod";

export const RoomStatusSchema = z.enum(["waiting", "playing", "finished"]);

export const GameStatusSchema = z.enum([
    "starting",
    "dealing",
    "in_progress",
    "paused",
    "round_finished",
    "finished",
    "cancelled",
]);

export const GameDirectionSchema = z.enum(["clockwise", "counter_clockwise"]);

export const TurnPhaseSchema = z.enum(["play_or_draw", "drawn_card_decision", "choose_color", "challenge_pending"]);

export const ConnectionStatusSchema = z.enum(["connected", "disconnected"]);
