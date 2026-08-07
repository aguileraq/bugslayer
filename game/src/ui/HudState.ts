/**
 * Phaser-independent HUD state model.
 * Stores all values the HUD needs to display each frame.
 * The Phaser scene reads this to render.
 */
export interface HudState {
  readonly playerHp: number;
  readonly playerMaxHp: number;
  readonly score: number;
  readonly streak: number;
  readonly enemyHp: number;
  readonly enemyMaxHp: number;
  readonly enemyName: string;
  readonly challengeActive: boolean;
  readonly challengeRemainingMs: number;
  readonly challengeTimeLimitMs: number;
  readonly penaltyActive: boolean;
}

export function createInitialHudState(): HudState {
  return {
    playerHp: 100,
    playerMaxHp: 100,
    score: 0,
    streak: 0,
    enemyHp: 0,
    enemyMaxHp: 0,
    enemyName: '',
    challengeActive: false,
    challengeRemainingMs: 0,
    challengeTimeLimitMs: 0,
    penaltyActive: false,
  };
}
