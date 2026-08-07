/**
 * Queue of visual feedback events to display.
 * The Phaser UI layer reads and consumes these to animate
 * correct/incorrect/timeout/pause-blocked effects.
 */

export type FeedbackType = 'correct' | 'incorrect' | 'timeout' | 'pauseBlocked';

export interface FeedbackEvent {
  readonly type: FeedbackType;
  readonly timestamp: number;
  readonly data?: Readonly<Record<string, string | number>> | undefined;
}

export class FeedbackQueue {
  readonly #events: FeedbackEvent[] = [];
  #elapsedMs = 0;

  public get pending(): readonly FeedbackEvent[] {
    return this.#events;
  }

  public get hasPending(): boolean {
    return this.#events.length > 0;
  }

  public emit(type: FeedbackType, data?: Readonly<Record<string, string | number>>): void {
    this.#events.push({ type, timestamp: this.#elapsedMs, data });
  }

  public emitCorrect(): void {
    this.emit('correct');
  }

  public emitIncorrect(correctAnswer?: string): void {
    this.emit('incorrect', correctAnswer !== undefined ? { correctAnswer } : undefined);
  }

  public emitTimeout(correctAnswer?: string): void {
    this.emit('timeout', correctAnswer !== undefined ? { correctAnswer } : undefined);
  }

  public emitPauseBlocked(): void {
    this.emit('pauseBlocked');
  }

  /**
   * Consume and return all pending events, clearing the queue.
   */
  public flush(): readonly FeedbackEvent[] {
    const events = [...this.#events];
    this.#events.length = 0;
    return events;
  }

  /**
   * Advance internal clock (for timestamp purposes).
   */
  public update(deltaMs: number): void {
    this.#elapsedMs += deltaMs;
  }

  public reset(): void {
    this.#events.length = 0;
    this.#elapsedMs = 0;
  }
}
