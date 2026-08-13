import { describe, expect, it } from 'vitest';
import { getCardImage } from '../get-card-image';

describe('getCardImage', () => {
    it('should return correct path for number cards', () => {
        expect(getCardImage({ color: 'red', value: '7' })).toBe('/cards/red/7.png');
        expect(getCardImage({ color: 'blue', value: '0' })).toBe('/cards/blue/0.png');
        expect(getCardImage({ color: 'green', type: '5' })).toBe('/cards/green/5.png'); // fallback to type
    });

    it('should return correct path for action cards', () => {
        expect(getCardImage({ color: 'yellow', value: 'skip' })).toBe('/cards/yellow/skip.png');
        expect(getCardImage({ color: 'green', value: 'reverse' })).toBe('/cards/green/reverse.png');
        expect(getCardImage({ color: 'blue', value: 'draw_two' })).toBe('/cards/blue/draw_2.png');
    });

    it('should return correct path for wild cards', () => {
        expect(getCardImage({ color: 'wild', value: 'wild' })).toBe('/cards/wild/wild.png');
        expect(getCardImage({ color: 'wild', value: 'wild_draw_four' })).toBe('/cards/wild/draw_4.png');
    });

    it('should return back image if card data is invalid', () => {
        expect(getCardImage(null)).toBe('/cards/back.png');
        expect(getCardImage(undefined)).toBe('/cards/back.png');
        expect(getCardImage({})).toBe('/cards/back.png');
        expect(getCardImage({ color: 'red' })).toBe('/cards/back.png');
        expect(getCardImage({ value: '5' })).toBe('/cards/back.png');
    });

    it('should handle alternative values from game engine', () => {
        expect(getCardImage({ color: 'red', value: '+2' })).toBe('/cards/red/draw_2.png');
        expect(getCardImage({ color: 'wild', value: '+4' })).toBe('/cards/wild/draw_4.png');
        expect(getCardImage({ color: 'yellow', value: 'draw2' })).toBe('/cards/yellow/draw_2.png');
        expect(getCardImage({ color: 'wild', value: 'draw4' })).toBe('/cards/wild/draw_4.png');
    });
});
