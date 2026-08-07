import { describe, expect, it } from 'vitest';

import {
  normalizeTypedAnswer,
  validateTypedAnswer,
  validateMultipleChoice,
} from '../../src/combat/AnswerValidator';
import { ChallengeManager } from '../../src/combat/ChallengeManager';

describe('normalizeTypedAnswer', () => {
  it('trims whitespace', () => {
    expect(normalizeTypedAnswer('  hello  ')).toBe('hello');
  });

  it('collapses consecutive internal spaces', () => {
    expect(normalizeTypedAnswer('a   b   c')).toBe('a b c');
  });

  it('removes non-printable characters', () => {
    expect(normalizeTypedAnswer('he\x00ll\x01o')).toBe('hello');
  });

  it('preserves valid symbols and accented characters', () => {
    expect(normalizeTypedAnswer('á + ñ = ü')).toBe('á + ñ = ü');
  });

  it('handles empty string', () => {
    expect(normalizeTypedAnswer('')).toBe('');
    expect(normalizeTypedAnswer('   ')).toBe('');
  });
});

describe('validateTypedAnswer', () => {
  it('matches case-insensitive by default', () => {
    expect(validateTypedAnswer(';', [';'])).toBe(true);
    expect(validateTypedAnswer('Number', ['number'])).toBe(true);
    expect(validateTypedAnswer('NUMBER', ['number'])).toBe(true);
  });

  it('respects caseSensitive flag', () => {
    expect(validateTypedAnswer('Number', ['number'], true)).toBe(false);
    expect(validateTypedAnswer('number', ['number'], true)).toBe(true);
  });

  it('matches any of multiple accepted answers', () => {
    expect(validateTypedAnswer(';', [';', 'semicolon'])).toBe(true);
    expect(validateTypedAnswer('semicolon', [';', 'semicolon'])).toBe(true);
    expect(validateTypedAnswer('colon', [';', 'semicolon'])).toBe(false);
  });

  it('normalizes before comparing', () => {
    expect(validateTypedAnswer('  ;  ', [';'])).toBe(true);
    expect(validateTypedAnswer('\x00;\x01', [';'])).toBe(true);
  });

  it('rejects empty answer against non-empty accepted', () => {
    expect(validateTypedAnswer('', [';'])).toBe(false);
    expect(validateTypedAnswer('   ', [';'])).toBe(false);
  });
});

describe('validateMultipleChoice', () => {
  it('returns true when selected matches correct', () => {
    expect(validateMultipleChoice(0, 0, 3)).toBe(true);
    expect(validateMultipleChoice(2, 2, 4)).toBe(true);
  });

  it('returns false when selected does not match', () => {
    expect(validateMultipleChoice(1, 0, 3)).toBe(false);
  });

  it('returns false for out-of-range selection', () => {
    expect(validateMultipleChoice(-1, 0, 3)).toBe(false);
    expect(validateMultipleChoice(3, 0, 3)).toBe(false);
    expect(validateMultipleChoice(4, 0, 4)).toBe(false);
  });
});

describe('ChallengeManager', () => {
  const config = {
    challengePool: ['syntax-01', 'syntax-02', 'syntax-03'],
    challengeIntervalMs: 5000,
    defaultTimeLimitMs: 8000,
  };

  it('starts with no active challenge and full interval', () => {
    const manager = new ChallengeManager(config);

    expect(manager.hasActiveChallenge).toBe(false);
    expect(manager.activeChallenge).toBeNull();
    expect(manager.intervalRemainingMs).toBe(5000);
    expect(manager.availableCount).toBe(3);
  });

  it('presents a challenge after interval expires', () => {
    const manager = new ChallengeManager(config);

    // Advance 4999ms — not yet
    expect(manager.advanceInterval(4999)).toBeNull();

    // Advance 1ms more — interval triggers, returns an ID
    const id = manager.advanceInterval(1);
    expect(id).toBe('syntax-01');
    expect(manager.availableCount).toBe(2);
  });

  it('does not advance interval while a challenge is active', () => {
    const manager = new ChallengeManager(config);

    manager.advanceInterval(5000); // triggers
    manager.present('syntax-01', 'typed');

    // Interval should not advance
    const result = manager.advanceInterval(10000);
    expect(result).toBeNull();
  });

  it('tracks active challenge with remaining time', () => {
    const manager = new ChallengeManager(config);

    manager.present('syntax-01', 'typed', 8000);

    const active = manager.activeChallenge;
    expect(active).not.toBeNull();
    expect(active!.id).toBe('syntax-01');
    expect(active!.mode).toBe('typed');
    expect(active!.remainingMs).toBe(8000);
    expect(active!.timeLimitMs).toBe(8000);
  });

  it('timer expires and returns true', () => {
    const manager = new ChallengeManager(config);

    manager.present('syntax-01', 'typed', 8000);

    expect(manager.advanceTimer(7999)).toBe(false);
    expect(manager.advanceTimer(1)).toBe(true); // expired
    expect(manager.activeChallenge!.remainingMs).toBe(0);
  });

  it('close resets interval to full', () => {
    const manager = new ChallengeManager(config);

    manager.present('syntax-01', 'typed');
    manager.close('correct');

    expect(manager.hasActiveChallenge).toBe(false);
    expect(manager.intervalRemainingMs).toBe(5000);
  });

  it('selects without repetition until pool is exhausted', () => {
    const manager = new ChallengeManager(config);

    const ids: string[] = [];
    for (let i = 0; i < 3; i++) {
      manager.advanceInterval(5000);
      const id = manager.advanceInterval(0);
      if (id !== null) {
        ids.push(id);
        manager.present(id, 'typed');
        manager.close('correct');
      }
    }

    expect(ids).toEqual(['syntax-01', 'syntax-02', 'syntax-03']);
    expect(manager.availableCount).toBe(0);
  });

  it('reconstructs pool without repeating last presented', () => {
    const manager = new ChallengeManager(config);

    // Exhaust pool
    for (let i = 0; i < 3; i++) {
      manager.advanceInterval(5000);
      const id = manager.advanceInterval(0);
      if (id !== null) {
        manager.present(id, 'typed');
        manager.close('correct');
      }
    }

    // Next selection should reconstruct — first ID should not be 'syntax-03' (last presented)
    manager.advanceInterval(5000);
    const nextId = manager.advanceInterval(0);
    expect(nextId).not.toBe('syntax-03');
  });

  it('closeSilently does not count as correct or incorrect', () => {
    const manager = new ChallengeManager(config);

    manager.present('syntax-01', 'typed');
    manager.closeSilently();

    expect(manager.hasActiveChallenge).toBe(false);
    expect(manager.intervalRemainingMs).toBe(5000);
  });

  it('reset restores initial state', () => {
    const manager = new ChallengeManager(config);

    manager.advanceInterval(5000);
    manager.present('syntax-01', 'typed');
    manager.close('correct');

    manager.reset();

    expect(manager.hasActiveChallenge).toBe(false);
    expect(manager.availableCount).toBe(3);
    expect(manager.intervalRemainingMs).toBe(5000);
  });
});
