import { AppError } from "#shared/errors/AppError.js";
import { gameEngine } from "./game.engine.js";

describe("Game Engine", () => {
    const roomCode = "ROOM_TEST";
    const players = [
        { id: "p1", name: "Player 1" },
        { id: "p2", name: "Player 2" },
        { id: "p3", name: "Player 3" },
    ];

    beforeEach(() => {
        gameEngine.activeGames.clear();
    });

    describe("initializeGame", () => {
        it("should initialize a game properly", () => {
            const game = gameEngine.initializeGame(roomCode, players);

            expect(game.roomCode).toBe(roomCode);
            expect(game.status).toBe("in_progress");
            expect(game.direction).toBe("clockwise");
            expect(game.players).toHaveLength(3);
            expect(game.players[0].hand).toHaveLength(7);
            expect(game.deck.length).toBeGreaterThan(0);
            expect(game.discardPile).toHaveLength(1);
            expect(game.topCard).toBeDefined();
            expect(game.currentColor).toBe(game.topCard.color);
        });
    });

    describe("drawCard", () => {
        it("should allow a player to draw a card", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const initialHandSize = game.players[0].hand.length;
            const currentPlayerId = game.currentTurn;

            gameEngine.drawCard(roomCode, currentPlayerId);

            const updatedPlayer = game.players.find((p) => p.id === currentPlayerId);
            expect(updatedPlayer.hand).toHaveLength(initialHandSize + 1);
            expect(game.currentTurn).not.toBe(currentPlayerId); // Turn passed
        });

        it("should throw error if it is not the player turn", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const wrongPlayerId = game.players[1].id;

            expect(() => gameEngine.drawCard(roomCode, wrongPlayerId)).toThrow(AppError);
        });
    });

    describe("playCard", () => {
        it("should allow a player to play a valid card", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const currentPlayer = game.players.find((p) => p.id === game.currentTurn);

            game.topCard = { id: "c1", color: "red", value: "5" };
            game.currentColor = "red";
            const validCard = { id: "c2", color: "red", value: "9" };
            currentPlayer.hand = [validCard];

            gameEngine.playCard(roomCode, currentPlayer.id, validCard.id);

            expect(game.discardPile[game.discardPile.length - 1]).toEqual(validCard);
            expect(currentPlayer.hand).toHaveLength(0);
            expect(game.status).toBe("finished"); // Jogo acaba pq a mão ficou vazia
            expect(game.winnerId).toBe(currentPlayer.id);
        });

        it("should apply reverse card effect", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const currentPlayer = game.players.find((p) => p.id === game.currentTurn);

            game.topCard = { id: "c1", color: "blue", value: "5" };
            game.currentColor = "blue";
            const reverseCard = { id: "c2", color: "blue", value: "reverse" };
            currentPlayer.hand = [reverseCard, { id: "c3", color: "red", value: "1" }];

            gameEngine.playCard(roomCode, currentPlayer.id, reverseCard.id);

            expect(game.direction).toBe("counter_clockwise");
        });
    });

    describe("getPublicGameState", () => {
        it("should return public state without exposing hands", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const publicState = gameEngine.getPublicGameState(game);

            expect(publicState.roomCode).toBe(roomCode);
            expect(publicState.players[0].cardCount).toBe(7);
            expect(publicState.players[0].hand).toBeUndefined(); // Ensure hand is not exposed
        });
    });

    describe("removePlayer", () => {
        it("should remove player and finish game if 1 player left", () => {
            const game = gameEngine.initializeGame(roomCode, [
                { id: "p1", name: "1" },
                { id: "p2", name: "2" },
            ]);

            gameEngine.removePlayer(roomCode, "p1");

            expect(game.players).toHaveLength(1);
            expect(game.status).toBe("finished");
            expect(game.winnerId).toBe("p2");
        });
    });
});
