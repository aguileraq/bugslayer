const MAX_CHARACTERS = 12;

const PRINTABLE_PATTERN = /^[\x20-\x7E\u00A0-\uFFFF]$/;

/**
 * Phaser-independent model for a typed challenge input field.
 * Manages the text buffer, cursor, and character constraints.
 * REQ-CHL-002: max 12 chars, arrows don't modify, Enter submits, Backspace deletes.
 */
export class TextInputModel {
  #value = '';
  #submitted = false;

  public get value(): string {
    return this.#value;
  }

  public get length(): number {
    return this.#value.length;
  }

  public get maxLength(): number {
    return MAX_CHARACTERS;
  }

  public get counter(): string {
    return `${this.#value.length}/${MAX_CHARACTERS}`;
  }

  public get submitted(): boolean {
    return this.#submitted;
  }

  /**
   * Attempts to insert a character.
   * - Ignores if at max capacity (12 chars) — REQ-CHL-002 §3
   * - Ignores non-printable characters
   * - Ignores arrow keys (handled by movement) — REQ-CHL-002 §4
   * Returns true if the character was accepted.
   */
  public type(char: string): boolean {
    if (this.#submitted) return false;
    if (char.length !== 1) return false;
    if (!PRINTABLE_PATTERN.test(char)) return false;
    if (this.#value.length >= MAX_CHARACTERS) return false;

    this.#value += char;
    return true;
  }

  /**
   * Deletes the last character (Backspace) — REQ-CHL-002 §6.
   */
  public backspace(): boolean {
    if (this.#submitted) return false;
    if (this.#value.length === 0) return false;

    this.#value = this.#value.slice(0, -1);
    return true;
  }

  /**
   * Submits the current value (Enter) — REQ-CHL-002 §5.
   * Returns the submitted value or null if already submitted.
   */
  public submit(): string | null {
    if (this.#submitted) return null;
    this.#submitted = true;
    return this.#value;
  }

  /**
   * Reset for new challenge or pause restore.
   */
  public reset(value = ''): void {
    this.#value = value;
    this.#submitted = false;
  }
}
