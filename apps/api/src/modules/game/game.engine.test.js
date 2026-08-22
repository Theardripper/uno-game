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

        it("should initialize every player with saidUno as false and an empty history", () => {
            const game = gameEngine.initializeGame(roomCode, players);

            expect(game.players.every((p) => p.saidUno === false)).toBe(true);
            expect(game.history).toEqual([]);
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

        it("should reset saidUno to false and log the action in history", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const currentPlayerId = game.currentTurn;
            const player = game.players.find((p) => p.id === currentPlayerId);
            player.saidUno = true;

            gameEngine.drawCard(roomCode, currentPlayerId);

            expect(player.saidUno).toBe(false);
            expect(game.history).toHaveLength(1);
            expect(game.history[0]).toMatchObject({ player: currentPlayerId, action: "drew_card" });
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

        it("should reset saidUno and log the action in history when a card is played", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const currentPlayer = game.players.find((p) => p.id === game.currentTurn);
            currentPlayer.saidUno = true;

            game.topCard = { id: "c1", color: "red", value: "5" };
            game.currentColor = "red";
            const validCard = { id: "c2", color: "red", value: "9" };
            currentPlayer.hand = [validCard, { id: "c3", color: "blue", value: "3" }];

            gameEngine.playCard(roomCode, currentPlayer.id, validCard.id);

            expect(currentPlayer.saidUno).toBe(false);
            expect(game.history).toHaveLength(1);
            expect(game.history[0]).toMatchObject({
                player: currentPlayer.id,
                action: "played_card",
                card: { color: "red", value: "9" },
            });
        });

        it("should reset saidUno of the penalized player when draw_two is played", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const currentPlayer = game.players.find((p) => p.id === game.currentTurn);
            const nextTurnIndex = gameEngine._getNextTurnIndex(game, 1);
            const nextPlayer = game.players[nextTurnIndex];
            nextPlayer.saidUno = true;

            game.topCard = { id: "c1", color: "red", value: "5" };
            game.currentColor = "red";
            const drawTwoCard = { id: "c2", color: "red", value: "draw_two" };
            currentPlayer.hand = [drawTwoCard, { id: "c3", color: "blue", value: "3" }];

            gameEngine.playCard(roomCode, currentPlayer.id, drawTwoCard.id);

            expect(nextPlayer.saidUno).toBe(false);
        });
    });

    describe("sayUno", () => {
        it("should mark the player as having said UNO when hand has exactly 1 card", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const player = game.players[0];
            player.hand = [{ id: "c1", color: "red", value: "5" }];

            gameEngine.sayUno(roomCode, player.id);

            expect(player.saidUno).toBe(true);
            expect(game.history).toHaveLength(1);
            expect(game.history[0]).toMatchObject({ player: player.id, action: "said_uno" });
        });

        it("should throw AppError when the player does not have exactly 1 card", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const player = game.players[0]; // ainda tem 7 cartas

            expect(() => gameEngine.sayUno(roomCode, player.id)).toThrow(AppError);
        });

        it("should throw AppError when the game is not in progress", () => {
            gameEngine.initializeGame(roomCode, players);
            const game = gameEngine.getGame(roomCode);
            game.status = "finished";

            expect(() => gameEngine.sayUno(roomCode, "p1")).toThrow(AppError);
        });

        it("should throw AppError when the player does not exist in the match", () => {
            gameEngine.initializeGame(roomCode, players);

            expect(() => gameEngine.sayUno(roomCode, "jogador-inexistente")).toThrow(AppError);
        });
    });

    describe("challengePlayer", () => {
        it("should succeed and apply a 2-card penalty when the challenged player did not say UNO", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const challenged = game.players[1];
            challenged.hand = [{ id: "c1", color: "red", value: "5" }];
            challenged.saidUno = false;
            const handSizeBefore = challenged.hand.length;

            const result = gameEngine.challengePlayer(roomCode, "p1", challenged.id);

            expect(result.success).toBe(true);
            expect(challenged.hand.length).toBe(handSizeBefore + 2);
            expect(challenged.saidUno).toBe(false);
            expect(game.history[game.history.length - 1]).toMatchObject({
                player: "p1",
                action: "challenge_success",
                challenged: challenged.id,
            });
        });

        it("should fail without penalty when the challenged player already said UNO", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const challenged = game.players[1];
            challenged.hand = [{ id: "c1", color: "red", value: "5" }];
            challenged.saidUno = true;
            const handSizeBefore = challenged.hand.length;

            const result = gameEngine.challengePlayer(roomCode, "p1", challenged.id);

            expect(result.success).toBe(false);
            expect(challenged.hand.length).toBe(handSizeBefore);
            expect(game.history[game.history.length - 1]).toMatchObject({
                player: "p1",
                action: "challenge_failed",
                challenged: challenged.id,
            });
        });

        it("should throw AppError when the challenged player does not have exactly 1 card", () => {
            gameEngine.initializeGame(roomCode, players);

            expect(() => gameEngine.challengePlayer(roomCode, "p1", "p2")).toThrow(AppError);
        });

        it("should throw AppError when the challenger does not exist", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            game.players[1].hand = [{ id: "c1", color: "red", value: "5" }];

            expect(() => gameEngine.challengePlayer(roomCode, "inexistente", "p2")).toThrow(AppError);
        });

        it("should throw AppError when the challenged player does not exist", () => {
            gameEngine.initializeGame(roomCode, players);

            expect(() => gameEngine.challengePlayer(roomCode, "p1", "inexistente")).toThrow(AppError);
        });
    });

    describe("hasValidMove", () => {
        it("should return true when the player has at least one playable card", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const player = game.players[0];
            game.topCard = { id: "top", color: "red", value: "5" };
            game.currentColor = "red";
            player.hand = [{ id: "c1", color: "blue", value: "2" }, { id: "c2", color: "red", value: "9" }];

            expect(gameEngine.hasValidMove(roomCode, player.id)).toBe(true);
        });

        it("should return false when the player has no playable card", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const player = game.players[0];
            game.topCard = { id: "top", color: "red", value: "5" };
            game.currentColor = "red";
            player.hand = [{ id: "c1", color: "blue", value: "2" }, { id: "c2", color: "green", value: "8" }];

            expect(gameEngine.hasValidMove(roomCode, player.id)).toBe(false);
        });

        it("should return true for any hand containing a wild card", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const player = game.players[0];
            game.topCard = { id: "top", color: "red", value: "5" };
            game.currentColor = "red";
            player.hand = [{ id: "c1", color: "wild", value: "wild" }];

            expect(gameEngine.hasValidMove(roomCode, player.id)).toBe(true);
        });

        it("should throw AppError when the game is not in progress", () => {
            gameEngine.initializeGame(roomCode, players);
            const game = gameEngine.getGame(roomCode);
            game.status = "finished";

            expect(() => gameEngine.hasValidMove(roomCode, "p1")).toThrow(AppError);
        });

        it("should throw AppError when the player does not exist in the match", () => {
            gameEngine.initializeGame(roomCode, players);

            expect(() => gameEngine.hasValidMove(roomCode, "inexistente")).toThrow(AppError);
        });
    });

    describe("getPlayerHand", () => {
        it("should return only the requested player hand", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const player = game.players[0];

            const result = gameEngine.getPlayerHand(roomCode, player.id);

            expect(result).toEqual({ roomCode, playerId: player.id, hand: player.hand });
        });

        it("should throw AppError when the game does not exist", () => {
            expect(() => gameEngine.getPlayerHand("SALA_INEXISTENTE", "p1")).toThrow(AppError);
        });

        it("should throw AppError when the player does not exist in the match", () => {
            gameEngine.initializeGame(roomCode, players);

            expect(() => gameEngine.getPlayerHand(roomCode, "inexistente")).toThrow(AppError);
        });
    });

    describe("getHistory", () => {
        it("should return the accumulated history of actions", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            const currentPlayerId = game.currentTurn;

            gameEngine.drawCard(roomCode, currentPlayerId);

            const result = gameEngine.getHistory(roomCode);

            expect(result.roomCode).toBe(roomCode);
            expect(result.history).toHaveLength(1);
            expect(result.history[0]).toMatchObject({ player: currentPlayerId, action: "drew_card" });
        });

        it("should throw AppError when the game does not exist", () => {
            expect(() => gameEngine.getHistory("SALA_INEXISTENTE")).toThrow(AppError);
        });
    });

    describe("getScores", () => {
        it("should return the sum of card points still in hand for each player while in progress", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            game.players[0].hand = [{ id: "c1", color: "red", value: "5", score: 5 }];
            game.players[1].hand = [{ id: "c2", color: "blue", value: "skip", score: 20 }];
            game.players[2].hand = [];

            const result = gameEngine.getScores(roomCode);

            expect(result.scores).toEqual({ p1: 5, p2: 20, p3: 0 });
        });

        it("should return the final matchScores when the game has finished", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            game.status = "finished";
            game.winnerId = "p1";
            game.matchScores = { p1: 45, p2: 20, p3: 25 };

            const result = gameEngine.getScores(roomCode);

            expect(result.scores).toEqual({ p1: 45, p2: 20, p3: 25 });
        });

        it("should throw AppError when the game does not exist", () => {
            expect(() => gameEngine.getScores("SALA_INEXISTENTE")).toThrow(AppError);
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

        it("should expose saidUno per player in the public state", () => {
            const game = gameEngine.initializeGame(roomCode, players);
            game.players[0].saidUno = true;

            const publicState = gameEngine.getPublicGameState(game);

            expect(publicState.players[0].saidUno).toBe(true);
            expect(publicState.players[1].saidUno).toBe(false);
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