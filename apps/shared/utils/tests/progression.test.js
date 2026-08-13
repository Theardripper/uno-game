import { getLevel, getLevelProgress, calculateXpEarned, BASE_XP_WIN, BASE_XP_WO, BASE_XP_LOSS } from '../progression.js';

describe('Progression Utilities', () => {
    describe('getLevel', () => {
        it('should return level 1 for 0 XP', () => {
            expect(getLevel(0)).toBe(1);
        });

        it('should return level 2 for 100 XP', () => {
            expect(getLevel(100)).toBe(2);
        });

        it('should return level 3 for 400 XP', () => {
            expect(getLevel(400)).toBe(3);
        });

        it('should return level 4 for 900 XP', () => {
            expect(getLevel(900)).toBe(4);
        });

        it('should return level 5 for 1600 XP', () => {
            expect(getLevel(1600)).toBe(5);
        });

        it('should return level 6 for 2500 XP', () => {
            expect(getLevel(2500)).toBe(6);
        });

        it('should return correct level for intermediate XP values', () => {
            expect(getLevel(2350)).toBe(5); // Level 5 is 1600-2499
            expect(getLevel(2499)).toBe(5);
        });
    });

    describe('getLevelProgress', () => {
        it('should calculate correct progress for 2350 XP', () => {
            const progress = getLevelProgress(2350);
            
            expect(progress.level).toBe(5);
            expect(progress.totalXp).toBe(2350);
            expect(progress.levelStartTotalXp).toBe(1600);
            expect(progress.nextLevelXp).toBe(2500);
            
            // 2350 - 1600 = 750
            expect(progress.currentLevelXp).toBe(750);
            
            // 2500 - 1600 = 900
            expect(progress.levelSize).toBe(900);
            
            // 2500 - 2350 = 150
            expect(progress.xpToNextLevel).toBe(150);
            
            // floor(750 / 900 * 100) = floor(83.33) = 83
            expect(progress.progressPercentage).toBe(83);
        });

        it('should calculate correct progress for 0 XP', () => {
            const progress = getLevelProgress(0);
            
            expect(progress.level).toBe(1);
            expect(progress.currentLevelXp).toBe(0);
            expect(progress.nextLevelXp).toBe(100);
            expect(progress.xpToNextLevel).toBe(100);
            expect(progress.progressPercentage).toBe(0);
        });
    });

    describe('calculateXpEarned', () => {
        it('should calculate WIN XP correctly', () => {
            // Score = 185, WIN => 100 + floor(18.5) = 118
            expect(calculateXpEarned(185, 'WIN')).toBe(118);
        });

        it('should calculate LOSS XP correctly', () => {
            // Score = 96, LOSS => 40 + floor(9.6) = 49
            expect(calculateXpEarned(96, 'LOSS')).toBe(49);
        });

        it('should calculate WO XP correctly', () => {
            // Score = 120, WO => 60 + floor(12.0) = 72
            expect(calculateXpEarned(120, 'WO')).toBe(72);
        });

        it('should not deduct XP for negative scores', () => {
            // Score = -50, WIN => 100 + floor(0/10) = 100
            expect(calculateXpEarned(-50, 'WIN')).toBe(100);
        });
    });
});
