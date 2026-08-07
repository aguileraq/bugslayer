/**
 * Manages the extraProjectiles penalty effect.
 * Only implements extraProjectiles (design.md §4.10):
 * - Active/inactive state with remainingMs
 * - Duration configurable (default 5000 ms)
 * - Multiplies projectilesPerBurst by multiplier (default ×2)
 * - New penalty resets duration (doesn't stack)
 * - Cancelled at encounter end, restart, or menu exit
 */

export interface PenaltyConfig {
  readonly durationMs: number;
  readonly multiplier: number;
}

const DEFAULT_CONFIG: PenaltyConfig = {
  durationMs: 5000,
  multiplier: 2,
};

export class PenaltyManager {
  readonly #config: PenaltyConfig;
  #remainingMs = 0;

  public constructor(config: Partial<PenaltyConfig> = {}) {
    this.#config = { ...DEFAULT_CONFIG, ...config };
  }

  public get active(): boolean {
    return this.#remainingMs > 0;
  }

  public get remainingMs(): number {
    return this.#remainingMs;
  }

  public get multiplier(): number {
    return this.#config.multiplier;
  }

  /**
   * Returns the effective projectilesPerBurst for the current frame.
   * If penalty is active, multiplies the base value.
   * Respects pool capacity via optional cap parameter.
   */
  public effectiveBurst(baseBurst: number, maxCapacity?: number): number {
    if (!this.active) return baseBurst;

    const multiplied = baseBurst * this.#config.multiplier;
    if (maxCapacity !== undefined) {
      return Math.min(multiplied, maxCapacity);
    }
    return multiplied;
  }

  /**
   * Activate the penalty. If already active, resets duration (doesn't stack).
   * REQ-CHL-005 §5: activar extraProjectiles durante 5 segundos.
   */
  public activate(): void {
    this.#remainingMs = this.#config.durationMs;
  }

  /**
   * Advance the penalty timer by deltaMs. Call every gameplay frame.
   */
  public update(deltaMs: number): void {
    if (this.#remainingMs <= 0) return;
    this.#remainingMs = Math.max(this.#remainingMs - deltaMs, 0);
  }

  /**
   * Cancel immediately (encounter end, restart, menu exit).
   * REQ-PROG-001 §9: retirar extraProjectiles al comenzar Transitioning.
   */
  public cancel(): void {
    this.#remainingMs = 0;
  }
}
