import type { GameStateMachine } from '../core/GameStateMachine';
import type { GameState, PauseContext, ChallengePauseSnapshot } from '../types';

/**
 * Phaser-independent controller for pause logic during combat.
 * Encapsulates the rules from SPEC-003 §10:
 * - Manual pause: accepted from Playing, rejected from Challenge (pauseBlocked)
 * - Safety pause: accepted from Playing and Challenge (with snapshot)
 * - Resume returns to saved state
 */
export interface PauseControllerResult {
  readonly accepted: boolean;
  readonly type: 'manual' | 'safety' | 'blocked';
}

export class PauseController {
  readonly #stateMachine: GameStateMachine;

  public constructor(stateMachine: GameStateMachine) {
    this.#stateMachine = stateMachine;
  }

  /**
   * Attempt manual pause (Escape key).
   * Accepted from Playing/Exploration, rejected from Challenge.
   */
  public requestManualPause(): PauseControllerResult {
    const state = this.#stateMachine.state;

    if (state === 'Challenge') {
      // Rejected — pauseBlocked
      this.#stateMachine.transition('manualPauseRequested');
      return { accepted: false, type: 'blocked' };
    }

    if (state === 'Playing' || state === 'Exploration') {
      const context: PauseContext = { cause: 'manual', returnState: state };
      const result = this.#stateMachine.transition('manualPauseRequested', context);
      return { accepted: result.allowed, type: 'manual' };
    }

    return { accepted: false, type: 'blocked' };
  }

  /**
   * Trigger safety pause (visibility loss).
   * Accepted from Playing and Challenge (with snapshot).
   */
  public requestSafetyPause(challengeSnapshot?: ChallengePauseSnapshot): PauseControllerResult {
    const state = this.#stateMachine.state;

    if (state === 'Playing') {
      const context: PauseContext = { cause: 'visibility', returnState: 'Playing' };
      const result = this.#stateMachine.transition('safetyPauseRequested', context);
      return { accepted: result.allowed, type: 'safety' };
    }

    if (state === 'Challenge') {
      if (challengeSnapshot === undefined) {
        const context: PauseContext = {
          cause: 'visibility',
          returnState: 'Challenge',
          challengeSnapshot: { remainingMs: 0, typedAnswer: '', selectedOptionIndex: null },
        };
        this.#stateMachine.transition('safetyPauseRequested', context);
      } else {
        const context: PauseContext = {
          cause: 'visibility',
          returnState: 'Challenge',
          challengeSnapshot,
        };
        this.#stateMachine.transition('safetyPauseRequested', context);
      }
      return { accepted: true, type: 'safety' };
    }

    if (state === 'Exploration') {
      const context: PauseContext = { cause: 'visibility', returnState: 'Exploration' };
      this.#stateMachine.transition('safetyPauseRequested', context);
      return { accepted: true, type: 'safety' };
    }

    return { accepted: false, type: 'blocked' };
  }

  /**
   * Resume from pause.
   */
  public resume(): GameState | null {
    if (this.#stateMachine.state !== 'Paused') return null;
    const result = this.#stateMachine.transition('resumeRequested');
    return result.to;
  }

  /**
   * Restart run from pause or defeat.
   */
  public restart(): boolean {
    const result = this.#stateMachine.transition('restartRequested');
    return result.allowed;
  }

  /**
   * Exit to menu from pause or defeat.
   */
  public exitToMenu(): boolean {
    const result = this.#stateMachine.transition('exitToMenuRequested');
    return result.allowed;
  }
}
