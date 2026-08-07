import { describe, expect, it } from 'vitest';

import { createInitialHudState, type HudState } from '../../src/ui/HudState';
import { FeedbackQueue } from '../../src/ui/FeedbackQueue';
import { IncorrectFeedbackTimer } from '../../src/ui/ChallengeDisplay';

describe('HudState', () => {
  it('creates initial state with defaults', () => {
    const state = createInitialHudState();

    expect(state.playerHp).toBe(100);
    expect(state.playerMaxHp).toBe(100);
    expect(state.score).toBe(0);
    expect(state.streak).toBe(0);
    expect(state.enemyHp).toBe(0);
    expect(state.enemyMaxHp).toBe(0);
    expect(state.challengeActive).toBe(false);
    expect(state.penaltyActive).toBe(false);
  });
});

describe('FeedbackQueue', () => {
  it('starts empty with no pending events', () => {
    const queue = new FeedbackQueue();

    expect(queue.hasPending).toBe(false);
    expect(queue.pending).toHaveLength(0);
  });

  it('emits and queues feedback events', () => {
    const queue = new FeedbackQueue();

    queue.emitCorrect();
    queue.emitIncorrect('number');
    queue.emitTimeout(';');
    queue.emitPauseBlocked();

    expect(queue.hasPending).toBe(true);
    expect(queue.pending).toHaveLength(4);
    expect(queue.pending[0]!.type).toBe('correct');
    expect(queue.pending[1]!.type).toBe('incorrect');
    expect(queue.pending[1]!.data).toEqual({ correctAnswer: 'number' });
    expect(queue.pending[2]!.type).toBe('timeout');
    expect(queue.pending[2]!.data).toEqual({ correctAnswer: ';' });
    expect(queue.pending[3]!.type).toBe('pauseBlocked');
  });

  it('flush returns and clears all pending events', () => {
    const queue = new FeedbackQueue();

    queue.emitCorrect();
    queue.emitIncorrect();

    const flushed = queue.flush();
    expect(flushed).toHaveLength(2);
    expect(queue.hasPending).toBe(false);
    expect(queue.pending).toHaveLength(0);
  });

  it('tracks timestamps via update', () => {
    const queue = new FeedbackQueue();

    queue.update(1000);
    queue.emitCorrect();
    queue.update(500);
    queue.emitIncorrect();

    expect(queue.pending[0]!.timestamp).toBe(1000);
    expect(queue.pending[1]!.timestamp).toBe(1500);
  });

  it('reset clears events and clock', () => {
    const queue = new FeedbackQueue();

    queue.update(5000);
    queue.emitCorrect();
    queue.reset();

    expect(queue.hasPending).toBe(false);
  });
});

describe('IncorrectFeedbackTimer', () => {
  it('starts inactive with no display', () => {
    const timer = new IncorrectFeedbackTimer();

    expect(timer.active).toBe(false);
    expect(timer.display).toBeNull();
  });

  it('shows correct answer for 2 seconds (REQ-CHL-005 §4)', () => {
    const timer = new IncorrectFeedbackTimer();

    timer.show('number');

    expect(timer.active).toBe(true);
    expect(timer.display).toEqual({
      correctAnswer: 'number',
      remainingDisplayMs: 2000,
    });
  });

  it('expires after 2000ms', () => {
    const timer = new IncorrectFeedbackTimer();

    timer.show(';');
    timer.update(1000);
    expect(timer.active).toBe(true);
    expect(timer.display!.remainingDisplayMs).toBe(1000);

    timer.update(1000);
    expect(timer.active).toBe(false);
    expect(timer.display).toBeNull();
  });

  it('cancel clears immediately', () => {
    const timer = new IncorrectFeedbackTimer();

    timer.show('const');
    timer.cancel();

    expect(timer.active).toBe(false);
    expect(timer.display).toBeNull();
  });

  it('new show replaces previous', () => {
    const timer = new IncorrectFeedbackTimer();

    timer.show('first');
    timer.update(1500); // 500 remaining

    timer.show('second'); // replaces
    expect(timer.display!.correctAnswer).toBe('second');
    expect(timer.display!.remainingDisplayMs).toBe(2000);
  });
});
