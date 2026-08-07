import type { GameState, GameTransitionEvent, PauseContext } from '../types';

export interface TransitionResult {
  readonly allowed: boolean;
  readonly from: GameState;
  readonly to: GameState | null;
  readonly event: GameTransitionEvent;
}

export class GameStateMachineError extends Error {
  public readonly code = 'INVALID_TRANSITION';
  public readonly from: GameState;
  public readonly event: GameTransitionEvent;

  public constructor(from: GameState, event: GameTransitionEvent) {
    super(`Transition "${event}" is not allowed from state "${from}".`);
    this.name = 'GameStateMachineError';
    this.from = from;
    this.event = event;
  }
}

type TransitionEntry = readonly [GameTransitionEvent, GameState];

const TRANSITION_TABLE: Readonly<Record<GameState, readonly TransitionEntry[]>> = {
  Boot: [['bootComplete', 'LanguageSelect']],
  LanguageSelect: [['languageConfirmed', 'Menu']],
  Menu: [['startRun', 'Intro']],
  Intro: [['wakeDialogueComplete', 'Exploration']],
  Exploration: [
    ['dialogueStarted', 'Dialogue'],
    ['officeExitReached', 'Transitioning'],
    ['manualPauseRequested', 'Paused'],
    ['safetyPauseRequested', 'Paused'],
  ],
  Dialogue: [['dialogueComplete', 'Exploration']],
  Playing: [
    ['challengePresented', 'Challenge'],
    ['encounterCompleted', 'Transitioning'],
    ['manualPauseRequested', 'Paused'],
    ['safetyPauseRequested', 'Paused'],
    ['playerDefeated', 'Defeat'],
  ],
  Challenge: [
    ['challengeClosed', 'Playing'],
    ['encounterCompleted', 'Transitioning'],
    ['safetyPauseRequested', 'Paused'],
    ['playerDefeated', 'Defeat'],
  ],
  Paused: [
    ['resumeRequested', 'Exploration'], // placeholder; actual target from PauseContext
    ['restartRequested', 'Intro'],
    ['exitToMenuRequested', 'Menu'],
  ],
  Transitioning: [
    ['encounterReady', 'Playing'],
    ['nextEncounterReady', 'Playing'],
    ['finalSequenceReady', 'FinalSequence'],
  ],
  Defeat: [
    ['restartRequested', 'Intro'],
    ['exitToMenuRequested', 'Menu'],
  ],
  FinalSequence: [['extractionComplete', 'DemoEnd']],
  DemoEnd: [
    ['restartRequested', 'Intro'],
    ['exitToMenuRequested', 'Menu'],
  ],
};

export class GameStateMachine {
  #state: GameState;
  #pauseContext: PauseContext | null = null;
  readonly #history: TransitionResult[] = [];

  public constructor(initialState: GameState = 'Boot') {
    this.#state = initialState;
  }

  public get state(): GameState {
    return this.#state;
  }

  public get pauseContext(): PauseContext | null {
    return this.#pauseContext;
  }

  public get history(): readonly TransitionResult[] {
    return this.#history;
  }

  public canTransition(event: GameTransitionEvent): boolean {
    const entries = TRANSITION_TABLE[this.#state];
    return entries.some(([e]) => e === event);
  }

  public transition(event: GameTransitionEvent, pauseContext?: PauseContext): TransitionResult {
    const entries = TRANSITION_TABLE[this.#state];
    const match = entries.find(([e]) => e === event);

    if (match === undefined) {
      const result: TransitionResult = {
        allowed: false,
        from: this.#state,
        to: null,
        event,
      };
      this.#history.push(result);
      return result;
    }

    const from = this.#state;
    let to = match[1];

    // Handle pause entry: store context
    if (event === 'manualPauseRequested' || event === 'safetyPauseRequested') {
      if (pauseContext !== undefined) {
        this.#pauseContext = pauseContext;
      } else {
        // Default pause context if not provided
        this.#pauseContext = { cause: event === 'manualPauseRequested' ? 'manual' : 'visibility', returnState: from as 'Exploration' | 'Playing' };
      }
    }

    // Handle resume: restore from PauseContext
    if (event === 'resumeRequested' && this.#pauseContext !== null) {
      to = this.#pauseContext.returnState;
      this.#pauseContext = null;
    }

    this.#state = to;

    const result: TransitionResult = {
      allowed: true,
      from,
      to,
      event,
    };
    this.#history.push(result);
    return result;
  }

  public reset(state: GameState = 'Boot'): void {
    this.#state = state;
    this.#pauseContext = null;
  }
}
