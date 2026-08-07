/**
 * Phaser-independent state model for the challenge overlay display.
 * Stores all data needed to render the challenge UI each frame.
 */

export interface TypedChallengeDisplay {
  readonly mode: 'typed';
  readonly code: string;
  readonly instruction: string;
  readonly inputValue: string;
  readonly counter: string;
  readonly remainingMs: number;
  readonly timeLimitMs: number;
}

export interface MultipleChoiceChallengeDisplay {
  readonly mode: 'multiple-choice';
  readonly code: string;
  readonly instruction: string;
  readonly options: readonly string[];
  readonly selectedIndex: number | null;
  readonly remainingMs: number;
  readonly timeLimitMs: number;
}

export type ChallengeDisplay = TypedChallengeDisplay | MultipleChoiceChallengeDisplay;

export interface IncorrectFeedbackDisplay {
  readonly correctAnswer: string;
  readonly remainingDisplayMs: number;
}

const INCORRECT_DISPLAY_DURATION_MS = 2000;

export class IncorrectFeedbackTimer {
  #correctAnswer: string | null = null;
  #remainingMs = 0;

  public get active(): boolean {
    return this.#remainingMs > 0;
  }

  public get display(): IncorrectFeedbackDisplay | null {
    if (this.#correctAnswer === null || this.#remainingMs <= 0) return null;
    return {
      correctAnswer: this.#correctAnswer,
      remainingDisplayMs: this.#remainingMs,
    };
  }

  /**
   * Show the correct answer for 2 seconds after incorrect/timeout.
   * REQ-CHL-005 §4.
   */
  public show(correctAnswer: string): void {
    this.#correctAnswer = correctAnswer;
    this.#remainingMs = INCORRECT_DISPLAY_DURATION_MS;
  }

  public update(deltaMs: number): void {
    if (this.#remainingMs <= 0) return;
    this.#remainingMs = Math.max(this.#remainingMs - deltaMs, 0);
    if (this.#remainingMs <= 0) {
      this.#correctAnswer = null;
    }
  }

  public cancel(): void {
    this.#correctAnswer = null;
    this.#remainingMs = 0;
  }
}
