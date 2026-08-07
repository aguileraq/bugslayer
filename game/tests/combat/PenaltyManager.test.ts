import { describe, expect, it } from 'vitest';

import { PenaltyManager } from '../../src/combat/PenaltyManager';

describe('PenaltyManager', () => {
  it('starts inactive', () => {
    const manager = new PenaltyManager();

    expect(manager.active).toBe(false);
    expect(manager.remainingMs).toBe(0);
  });

  it('activates with configured duration (default 5000ms)', () => {
    const manager = new PenaltyManager();

    manager.activate();

    expect(manager.active).toBe(true);
    expect(manager.remainingMs).toBe(5000);
  });

  it('activates with custom duration', () => {
    const manager = new PenaltyManager({ durationMs: 3000, multiplier: 3 });

    manager.activate();

    expect(manager.remainingMs).toBe(3000);
    expect(manager.multiplier).toBe(3);
  });

  it('expires after full duration', () => {
    const manager = new PenaltyManager();

    manager.activate();
    manager.update(2500);
    expect(manager.active).toBe(true);
    expect(manager.remainingMs).toBe(2500);

    manager.update(2500);
    expect(manager.active).toBe(false);
    expect(manager.remainingMs).toBe(0);
  });

  it('does not go below zero on overshoot', () => {
    const manager = new PenaltyManager();

    manager.activate();
    manager.update(10000); // overshoot

    expect(manager.remainingMs).toBe(0);
    expect(manager.active).toBe(false);
  });

  it('new activation resets duration (does not stack)', () => {
    const manager = new PenaltyManager();

    manager.activate();
    manager.update(3000); // 2000 remaining

    manager.activate(); // reset to 5000
    expect(manager.remainingMs).toBe(5000);
  });

  it('cancel clears immediately', () => {
    const manager = new PenaltyManager();

    manager.activate();
    manager.update(1000); // 4000 remaining

    manager.cancel();
    expect(manager.active).toBe(false);
    expect(manager.remainingMs).toBe(0);
  });

  it('effectiveBurst returns base when inactive', () => {
    const manager = new PenaltyManager();

    expect(manager.effectiveBurst(1)).toBe(1);
    expect(manager.effectiveBurst(3)).toBe(3);
  });

  it('effectiveBurst multiplies when active (default ×2)', () => {
    const manager = new PenaltyManager();

    manager.activate();

    expect(manager.effectiveBurst(1)).toBe(2);
    expect(manager.effectiveBurst(3)).toBe(6);
  });

  it('effectiveBurst respects capacity cap', () => {
    const manager = new PenaltyManager({ durationMs: 5000, multiplier: 2 });

    manager.activate();

    expect(manager.effectiveBurst(5, 8)).toBe(8); // 5*2=10, capped at 8
    expect(manager.effectiveBurst(3, 8)).toBe(6); // 3*2=6, under cap
  });

  it('update does nothing when inactive', () => {
    const manager = new PenaltyManager();

    manager.update(5000);
    expect(manager.active).toBe(false);
    expect(manager.remainingMs).toBe(0);
  });
});
