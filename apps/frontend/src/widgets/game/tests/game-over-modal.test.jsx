import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { GameOverModal } from "../game-over-modal";
import { useGame } from "@/store/game/use-game";

// Mock do Zustand
vi.mock("@/store/game/use-game", () => ({
    useGame: vi.fn(),
}));

// Mock do Canvas Confetti
vi.mock("canvas-confetti", () => ({
    default: vi.fn(),
}));

describe("GameOverModal", () => {
    const mockOnLeave = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return null if game status is not finished", () => {
        useGame.mockReturnValue({
            status: "in_progress",
            winnerId: null,
            endReason: null,
            players: [],
        });

        const { container } = render(<GameOverModal localPlayerId="1" onLeave={mockOnLeave} isLeaving={false} />);
        expect(container.firstChild).toBeNull();
    });

    it("should display victory message and trigger confetti when local player wins", async () => {
        const confettiMock = (await import("canvas-confetti")).default;

        useGame.mockReturnValue({
            status: "finished",
            winnerId: "1",
            endReason: "NORMAL",
            players: [{ id: "1", name: "Player One", avatarSeed: "seed1" }],
            matchResults: [{ playerId: "1", score: 185, xpEarned: 118, level: 8, previousLevel: 7, totalXp: 2350 }],
        });

        render(<GameOverModal localPlayerId="1" onLeave={mockOnLeave} isLeaving={false} />);

        expect(screen.getAllByText("Você Venceu!")[0]).toBeDefined();
        expect(screen.getAllByText("Player One")[0]).toBeDefined();
        expect(screen.getAllByText("venceu a partida!")[0]).toBeDefined();
        expect(screen.getAllByText("185 pts")[0]).toBeDefined();
        expect(screen.getAllByText("+118 XP")[0]).toBeDefined();
        expect(screen.getAllByText("✨ LEVEL UP!")[0]).toBeDefined();

        expect(confettiMock).toHaveBeenCalledTimes(1);
    });

    it("should display defeat message and NOT trigger confetti when another player wins", async () => {
        const confettiMock = (await import("canvas-confetti")).default;

        useGame.mockReturnValue({
            status: "finished",
            winnerId: "2",
            endReason: "NORMAL",
            players: [{ id: "2", name: "Player Two", avatarSeed: "seed2" }, { id: "1", name: "Player One" }],
            matchResults: [{ playerId: "1", score: 96, xpEarned: 49, level: 8, previousLevel: 8, totalXp: 2350 }],
        });

        render(<GameOverModal localPlayerId="1" onLeave={mockOnLeave} isLeaving={false} />);

        expect(screen.getAllByText("Fim de Jogo")[0]).toBeDefined();
        expect(screen.getAllByText("Player Two")[0]).toBeDefined();
        expect(screen.getAllByText("foi o grande vencedor!")[0]).toBeDefined();

        expect(confettiMock).not.toHaveBeenCalled();
    });

    it("should display walkover message when endReason is PLAYER_LEFT", () => {
        useGame.mockReturnValue({
            status: "finished",
            winnerId: "1",
            endReason: "PLAYER_LEFT",
            players: [{ id: "1", name: "Player One", avatarSeed: "seed1" }],
        });

        render(<GameOverModal localPlayerId="1" onLeave={mockOnLeave} isLeaving={false} />);

        expect(screen.getAllByText("Você Venceu!")[0]).toBeDefined();
        expect(screen.getAllByText("Abandono (W.O.)")[0]).toBeDefined();
    });

    it("should call onLeave when 'Voltar ao Lobby' button is clicked", () => {
        useGame.mockReturnValue({
            status: "finished",
            winnerId: "1",
            endReason: "NORMAL",
            players: [{ id: "1", name: "Player One", avatarSeed: "seed1" }],
        });

        render(<GameOverModal localPlayerId="1" onLeave={mockOnLeave} isLeaving={false} />);

        const button = screen.getAllByRole("button", { name: /Voltar ao Lobby/i })[0];
        fireEvent.click(button);

        expect(mockOnLeave).toHaveBeenCalledTimes(1);
    });

    it("should display leaving text and disable button when isLeaving is true", () => {
        useGame.mockReturnValue({
            status: "finished",
            winnerId: "1",
            endReason: "NORMAL",
            players: [{ id: "1", name: "Player One", avatarSeed: "seed1" }],
        });

        render(<GameOverModal localPlayerId="1" onLeave={mockOnLeave} isLeaving={true} />);

        const button = screen.getAllByRole("button", { name: /Saindo\.\.\./i })[0];
        expect(button.disabled).toBe(true);
    });
});
