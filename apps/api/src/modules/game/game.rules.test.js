import { canPlayCard } from "./game.rules.js";

describe("Game Rules", () => {
    describe("canPlayCard", () => {
        it("should return true for wild cards regardless of top card or color", () => {
            const wildCard = { color: "wild", value: "wild" };
            const topCard = { color: "red", value: "5" };
            expect(canPlayCard(wildCard, topCard, "red")).toBe(true);
            expect(canPlayCard(wildCard, topCard, "blue")).toBe(true);
        });

        it("should return true if the color matches the current color", () => {
            const cardToPlay = { color: "red", value: "9" };
            const topCard = { color: "red", value: "5" };
            expect(canPlayCard(cardToPlay, topCard, "red")).toBe(true);

            const topCardWild = { color: "wild", value: "wild" };
            expect(canPlayCard(cardToPlay, topCardWild, "red")).toBe(true);
        });

        it("should return true if the value matches the top card", () => {
            const cardToPlay = { color: "blue", value: "5" };
            const topCard = { color: "red", value: "5" };
            expect(canPlayCard(cardToPlay, topCard, "red")).toBe(true);
        });

        it("should return false if neither color nor value matches", () => {
            const cardToPlay = { color: "blue", value: "2" };
            const topCard = { color: "red", value: "5" };
            expect(canPlayCard(cardToPlay, topCard, "red")).toBe(false);
        });
    });
});
