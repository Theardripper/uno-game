import { createDeck, drawCards, shuffleDeck } from "./game.deck.js";

describe("Game Deck", () => {
    describe("createDeck", () => {
        it("should create a deck with 108 cards", () => {
            const deck = createDeck();
            expect(deck).toHaveLength(108);
        });

        it("should have 4 colors", () => {
            const deck = createDeck();
            const colors = new Set(deck.map((c) => c.color).filter((c) => c !== "wild"));
            expect(colors.size).toBe(4);
            expect(colors.has("red")).toBe(true);
            expect(colors.has("blue")).toBe(true);
            expect(colors.has("green")).toBe(true);
            expect(colors.has("yellow")).toBe(true);
        });

        it("should have 8 wild cards", () => {
            const deck = createDeck();
            const wildCards = deck.filter((c) => c.color === "wild");
            expect(wildCards).toHaveLength(8);
        });
    });

    describe("shuffleDeck", () => {
        it("should shuffle the deck without changing its size", () => {
            const deck = createDeck();
            const originalLength = deck.length;
            const shuffledDeck = shuffleDeck([...deck]);
            expect(shuffledDeck).toHaveLength(originalLength);
            expect(shuffledDeck).not.toEqual(deck);
        });
    });

    describe("drawCards", () => {
        it("should draw the specified number of cards", () => {
            const deck = createDeck();
            const drawn = drawCards(deck, 5);
            expect(drawn).toHaveLength(5);
            expect(deck).toHaveLength(108 - 5);
        });

        it("should draw 1 card by default", () => {
            const deck = createDeck();
            const drawn = drawCards(deck);
            expect(drawn).toHaveLength(1);
            expect(deck).toHaveLength(107);
        });
    });
});
