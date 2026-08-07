import type {
  FinalSequenceConfig,
  FinalSequenceStep,
  FinalSequenceStepType,
} from '../types';

export type StepStatus = 'pending' | 'active' | 'completed' | 'timedOut';

export interface StepState {
  readonly step: FinalSequenceStep;
  readonly status: StepStatus;
  readonly elapsedMs: number;
}

export interface FinalSequenceControllerEvents {
  onStepStart?: (step: FinalSequenceStep, index: number) => void;
  onStepComplete?: (step: FinalSequenceStep, index: number) => void;
  onStepTimeout?: (step: FinalSequenceStep, index: number) => void;
  onSequenceComplete?: () => void;
}

const TIMEOUT_MS = 30_000;

/**
 * Phaser-independent controller for the narrative final sequence.
 * Advances through data-driven steps deterministically.
 * Each step has a condition (duration or signal) and a 30s safety timeout.
 */
export class FinalSequenceController {
  readonly #config: FinalSequenceConfig;
  readonly #events: FinalSequenceControllerEvents;
  #currentIndex = 0;
  #stepElapsedMs = 0;
  #active = false;
  #completed = false;
  #signalReceived = false;

  public constructor(config: FinalSequenceConfig, events: FinalSequenceControllerEvents = {}) {
    this.#config = config;
    this.#events = events;
  }

  public get currentIndex(): number {
    return this.#currentIndex;
  }

  public get currentStep(): FinalSequenceStep | undefined {
    return this.#config.steps[this.#currentIndex];
  }

  public get active(): boolean {
    return this.#active;
  }

  public get completed(): boolean {
    return this.#completed;
  }

  public get totalSteps(): number {
    return this.#config.steps.length;
  }

  public get progress(): number {
    if (this.#completed) return 1;
    return this.#currentIndex / this.#config.steps.length;
  }

  /**
   * Start the sequence. Call once after entering FinalSequence state.
   */
  public start(): void {
    if (this.#active || this.#completed) return;
    this.#active = true;
    this.#currentIndex = 0;
    this.#stepElapsedMs = 0;
    this.#signalReceived = false;
    this.#events.onStepStart?.(this.#config.steps[0]!, 0);
  }

  /**
   * Advance time. Call every frame with deltaMs.
   * Handles duration-based and timeout-based advancement.
   */
  public update(deltaMs: number): void {
    if (!this.#active || this.#completed) return;

    const step = this.currentStep;
    if (step === undefined) {
      this.complete();
      return;
    }

    this.#stepElapsedMs += deltaMs;

    // Check if step should advance
    if (this.shouldAdvance(step)) {
      this.advanceStep();
      return;
    }

    // Safety timeout
    if (this.#stepElapsedMs >= TIMEOUT_MS) {
      console.warn(`[FinalSequence] Step "${step.id}" timed out after 30s.`);
      this.#events.onStepTimeout?.(step, this.#currentIndex);
      this.advanceStep();
    }
  }

  /**
   * Signal that a step's external condition has been met.
   * Used for dialogue completion, animation end, etc.
   */
  public signal(signalName: string): void {
    const step = this.currentStep;
    if (step === undefined) return;
    if (step.completionSignal === signalName) {
      this.#signalReceived = true;
    }
  }

  private shouldAdvance(step: FinalSequenceStep): boolean {
    // Signal-based completion
    if (step.completionSignal !== undefined && this.#signalReceived) {
      return true;
    }

    // Duration-based completion
    if (step.durationMs !== undefined && this.#stepElapsedMs >= step.durationMs) {
      return true;
    }

    return false;
  }

  private advanceStep(): void {
    const step = this.currentStep;
    if (step !== undefined) {
      this.#events.onStepComplete?.(step, this.#currentIndex);
    }

    this.#currentIndex++;
    this.#stepElapsedMs = 0;
    this.#signalReceived = false;

    if (this.#currentIndex >= this.#config.steps.length) {
      this.complete();
      return;
    }

    const nextStep = this.currentStep;
    if (nextStep !== undefined) {
      this.#events.onStepStart?.(nextStep, this.#currentIndex);
    }
  }

  private complete(): void {
    this.#active = false;
    this.#completed = true;
    this.#events.onSequenceComplete?.();
  }

  public reset(): void {
    this.#currentIndex = 0;
    this.#stepElapsedMs = 0;
    this.#active = false;
    this.#completed = false;
    this.#signalReceived = false;
  }
}
