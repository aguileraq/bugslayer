import { describe, expect, it } from 'vitest';

import { RunManager } from '../../src/core/RunManager';
import { SessionSettings } from '../../src/core/SessionSettings';

function createRunManager(config?: { maxHp?: number; healingFraction?: number }): {
  run: RunManager;
  settings: SessionSettings;
} {
  const settings = new SessionSettings();
  settings.setLanguage('es');
  const run = new RunManager(settings, config);
  return { run, settings };
}

describe('RunManager', () => {
  describe('initial state', () => {
    it('starts with full HP, zero score/streak, and unlocked', () => {
      const { run } = createRunManager();

      expect(run.hp).toBe(100);
      expect(run.maxHp).toBe(100);
      expect(run.score).toBe(0);
      expect(run.streak).toBe(0);
      expect(run.maxStreak).toBe(0);
      expect(run.correctCount).toBe(0);
      expect(run.incorrectCount).toBe(0);
      expect(run.elapsedRunMs).toBe(0);
      expect(run.currentEncounterIndex).toBe(0);
      expect(run.locked).toBe(false);
      expect(run.isDefeated).toBe(false);
    });
  });

  describe('scoring — correct answer', () => {
    it('applies formula: 100 + floor(remainingMs/100) + streak×10', () => {
      const { run } = createRunManager();

      // First correct: streak becomes 1, score = 100 + floor(5000/100) + 1*10 = 160
      run.applyCorrect(5000);
      expect(run.score).toBe(160);
      expect(run.streak).toBe(1);
      expect(run.maxStreak).toBe(1);
      expect(run.correctCount).toBe(1);

      // Second correct: streak becomes 2, score += 100 + floor(3000/100) + 2*10 = 150
      run.applyCorrect(3000);
      expect(run.score).toBe(310);
      expect(run.streak).toBe(2);
      expect(run.maxStreak).toBe(2);
      expect(run.correctCount).toBe(2);
    });
  });

  describe('scoring — incorrect answer', () => {
    it('reduces score by 50 with floor at zero and resets streak', () => {
      const { run } = createRunManager();

      run.applyCorrect(5000); // score = 160, streak = 1
      run.applyIncorrect();
      expect(run.score).toBe(110); // 160 - 50
      expect(run.streak).toBe(0);
      expect(run.incorrectCount).toBe(1);
      expect(run.maxStreak).toBe(1); // preserved
    });

    it('does not go below zero', () => {
      const { run } = createRunManager();

      run.applyIncorrect();
      expect(run.score).toBe(0);
      run.applyIncorrect();
      expect(run.score).toBe(0);
      expect(run.incorrectCount).toBe(2);
    });
  });

  describe('HP and damage', () => {
    it('reduces HP by damage amount, floored at zero', () => {
      const { run } = createRunManager();

      run.applyDamage(30);
      expect(run.hp).toBe(70);
      expect(run.isDefeated).toBe(false);

      run.applyDamage(80);
      expect(run.hp).toBe(0);
      expect(run.isDefeated).toBe(true);
    });

    it('applies healing with cap at maxHp', () => {
      const { run } = createRunManager({ maxHp: 100, healingFraction: 0.3 });

      run.applyDamage(50);
      expect(run.hp).toBe(50);

      run.applyHealing(); // +30, total 80
      expect(run.hp).toBe(80);

      run.applyHealing(); // +30, capped at 100
      expect(run.hp).toBe(100);
    });
  });

  describe('lock on defeat', () => {
    it('prevents score and streak modifications after lock', () => {
      const { run } = createRunManager();

      run.applyCorrect(5000); // score = 160
      run.lock();

      run.applyCorrect(3000); // should be ignored
      expect(run.score).toBe(160);
      expect(run.streak).toBe(1);

      run.applyIncorrect(); // should be ignored
      expect(run.score).toBe(160);
      expect(run.streak).toBe(1);
    });

    it('prevents HP and time modifications after lock', () => {
      const { run } = createRunManager();

      run.lock();
      run.applyDamage(50);
      expect(run.hp).toBe(100);

      run.advanceTime(1000);
      expect(run.elapsedRunMs).toBe(0);
    });
  });

  describe('encounter progression', () => {
    it('advances encounter index', () => {
      const { run } = createRunManager();

      expect(run.currentEncounterIndex).toBe(0);
      run.advanceEncounter();
      expect(run.currentEncounterIndex).toBe(1);
      run.advanceEncounter();
      expect(run.currentEncounterIndex).toBe(2);
    });
  });

  describe('time tracking', () => {
    it('accumulates elapsed time', () => {
      const { run } = createRunManager();

      run.advanceTime(1000);
      run.advanceTime(500);
      expect(run.elapsedRunMs).toBe(1500);
    });
  });

  describe('statistics', () => {
    it('produces a snapshot with furthest encounter', () => {
      const { run } = createRunManager();

      run.applyCorrect(5000);
      run.applyCorrect(3000);
      run.applyIncorrect();
      run.advanceTime(60000);
      run.advanceEncounter(); // moved to index 1

      const stats = run.statistics();
      expect(stats.finalScore).toBe(260); // 160 + 150 - 50
      expect(stats.correctCount).toBe(2);
      expect(stats.incorrectCount).toBe(1);
      expect(stats.maxStreak).toBe(2);
      expect(stats.totalPlayTimeMs).toBe(60000);
      expect(stats.furthestEncounterId).toBe('mutable-widow');
    });

    it('returns null furthestEncounterId at index 0', () => {
      const { run } = createRunManager();
      const stats = run.statistics();
      expect(stats.furthestEncounterId).toBe('parse-mantis');
    });
  });

  describe('restart', () => {
    it('resets all gameplay values but preserves language', () => {
      const { run, settings } = createRunManager();

      run.applyCorrect(5000);
      run.applyDamage(30);
      run.advanceTime(10000);
      run.advanceEncounter();
      run.lock();

      run.restart();

      expect(run.hp).toBe(100);
      expect(run.score).toBe(0);
      expect(run.streak).toBe(0);
      expect(run.maxStreak).toBe(0);
      expect(run.correctCount).toBe(0);
      expect(run.incorrectCount).toBe(0);
      expect(run.elapsedRunMs).toBe(0);
      expect(run.currentEncounterIndex).toBe(0);
      expect(run.locked).toBe(false);
      expect(settings.language).toBe('es'); // preserved
    });
  });

  describe('state snapshot', () => {
    it('returns a complete readonly snapshot', () => {
      const { run } = createRunManager();

      run.applyCorrect(2000);
      run.applyDamage(10);

      const state = run.state;
      expect(state).toEqual({
        hp: 90,
        maxHp: 100,
        score: 130, // 100 + 20 + 10
        streak: 1,
        maxStreak: 1,
        correctCount: 1,
        incorrectCount: 0,
        elapsedRunMs: 0,
        currentEncounterIndex: 0,
        locked: false,
      });
    });
  });
});
