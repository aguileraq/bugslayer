/**
 * Phaser-independent model for a multiple-choice challenge.
 * Manages selection state and submission.
 * REQ-CHL-003: 3-4 options, keyboard 1-4 or click, exactly one correct.
 */
export class MultipleChoiceModel {
  readonly #optionCount: number;
  #selectedIndex: number | null = null;
  #submitted = false;

  public constructor(optionCount: number) {
    if (optionCount < 3 || optionCount > 4) {
      throw new Error(`Option count must be 3 or 4, got ${optionCount}.`);
    }
    this.#optionCount = optionCount;
  }

  public get optionCount(): number {
    return this.#optionCount;
  }

  public get selectedIndex(): number | null {
    return this.#selectedIndex;
  }

  public get submitted(): boolean {
    return this.#submitted;
  }

  /**
   * Select an option by index (0-based).
   * Selecting automatically submits — REQ-CHL-003 §2-3.
   * Returns true if valid and accepted.
   */
  public select(index: number): boolean {
    if (this.#submitted) return false;
    if (index < 0 || index >= this.#optionCount) return false;

    this.#selectedIndex = index;
    this.#submitted = true;
    return true;
  }

  /**
   * Select by keyboard number (1-based) — REQ-CHL-003 §2.
   * Ignores numbers without corresponding option — REQ-CHL-003 §4.
   */
  public selectByKey(key: string): boolean {
    const num = parseInt(key, 10);
    if (isNaN(num) || num < 1 || num > this.#optionCount) return false;
    return this.select(num - 1);
  }

  /**
   * Reset for pause restore.
   */
  public reset(selectedIndex: number | null = null): void {
    this.#selectedIndex = selectedIndex;
    this.#submitted = false;
  }
}
