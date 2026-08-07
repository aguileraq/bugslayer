export type ChallengeCloseReason = 'correct' | 'incorrect' | 'timeout' | 'encounterCompleted' | 'playerDefeated';

export interface ActiveChallenge {
  readonly id: string;
  readonly mode: 'typed' | 'multiple-choice';
  readonly remainingMs: number;
  readonly timeLimitMs: number;
}

export interface ChallengeManagerConfig {
  readonly challengePool: readonly string[];
  readonly challengeIntervalMs: number;
  readonly defaultTimeLimitMs: number;
}

export class ChallengeManager {
  readonly #config: ChallengeManagerConfig;
  #availableIds: string[];
  #lastPresentedId: string | null = null;
  #intervalRemainingMs: number;
  #activeId: string | null = null;
  #activeMode: 'typed' | 'multiple-choice' = 'typed';
  #challengeRemainingMs = 0;
  #challengeTimeLimitMs = 0;

  public constructor(config: ChallengeManagerConfig) {
    this.#config = config;
    this.#availableIds = [...config.challengePool];
    this.#intervalRemainingMs = config.challengeIntervalMs;
  }

  // ─── Getters ───────────────────────────────────────────────

  public get hasActiveChallenge(): boolean {
    return this.#activeId !== null;
  }

  public get activeChallenge(): ActiveChallenge | null {
    if (this.#activeId === null) return null;
    return {
      id: this.#activeId,
      mode: this.#activeMode,
      remainingMs: this.#challengeRemainingMs,
      timeLimitMs: this.#challengeTimeLimitMs,
    };
  }

  public get intervalRemainingMs(): number {
    return this.#intervalRemainingMs;
  }

  public get availableCount(): number {
    return this.#availableIds.length;
  }

  // ─── Interval (advances only in Playing, not in Challenge) ─

  /**
   * Advances the interval timer. Call only when state is Playing (no active Challenge).
   * Returns the ID of a challenge to present if the interval expires, or null.
   */
  public advanceInterval(deltaMs: number): string | null {
    if (this.#activeId !== null) return null; // interval frozen during Challenge

    this.#intervalRemainingMs -= deltaMs;

    if (this.#intervalRemainingMs <= 0) {
      const id = this.selectNext();
      if (id === null) return null;
      return id;
    }
    return null;
  }

  // ─── Presentation ──────────────────────────────────────────

  /**
   * Present a challenge (makes it active). Call when advanceInterval returns an ID.
   */
  public present(id: string, mode: 'typed' | 'multiple-choice', timeLimitMs?: number): void {
    this.#activeId = id;
    this.#activeMode = mode;
    this.#challengeTimeLimitMs = timeLimitMs ?? this.#config.defaultTimeLimitMs;
    this.#challengeRemainingMs = this.#challengeTimeLimitMs;
    this.#lastPresentedId = id;
  }

  // ─── Timer (advances only during active Challenge) ─────────

  /**
   * Advances the challenge timer. Returns true if expired.
   */
  public advanceTimer(deltaMs: number): boolean {
    if (this.#activeId === null) return false;

    this.#challengeRemainingMs -= deltaMs;
    if (this.#challengeRemainingMs <= 0) {
      this.#challengeRemainingMs = 0;
      return true; // expired
    }
    return false;
  }

  // ─── Close ─────────────────────────────────────────────────

  /**
   * Closes the active challenge for any reason.
   * Resets the interval to start from zero.
   */
  public close(reason: ChallengeCloseReason): void {
    this.#activeId = null;
    this.#challengeRemainingMs = 0;
    this.#challengeTimeLimitMs = 0;

    // Restart interval from zero (REQ-CHL-001 §7)
    this.#intervalRemainingMs = this.#config.challengeIntervalMs;
  }

  /**
   * Close silently — used for encounterCompleted and playerDefeated.
   * Does not count as correct or incorrect.
   */
  public closeSilently(): void {
    this.close('encounterCompleted');
  }

  // ─── Selection ─────────────────────────────────────────────

  /**
   * Select next challenge ID without repetition.
   * Reconstructs pool when exhausted, avoiding the last presented ID.
   */
  private selectNext(): string | null {
    if (this.#availableIds.length === 0) {
      this.reconstructPool();
    }

    if (this.#availableIds.length === 0) return null;

    const index = 0; // Deterministic: always pick first available
    const id = this.#availableIds[index];
    if (id === undefined) return null;
    this.#availableIds.splice(index, 1);
    return id;
  }

  private reconstructPool(): void {
    const pool = [...this.#config.challengePool];

    // Avoid repeating the last presented ID as the first in new cycle
    if (this.#lastPresentedId !== null && pool.length > 1) {
      const lastIndex = pool.indexOf(this.#lastPresentedId);
      if (lastIndex === 0) {
        // Move it to the end
        pool.push(pool.shift()!);
      }
    }

    this.#availableIds = pool;
  }

  // ─── Reset ─────────────────────────────────────────────────

  public reset(): void {
    this.#availableIds = [...this.#config.challengePool];
    this.#lastPresentedId = null;
    this.#intervalRemainingMs = this.#config.challengeIntervalMs;
    this.#activeId = null;
    this.#challengeRemainingMs = 0;
    this.#challengeTimeLimitMs = 0;
  }
}
