export const GAME_STATES = [
  'Boot',
  'LanguageSelect',
  'Menu',
  'Intro',
  'Exploration',
  'Dialogue',
  'Playing',
  'Challenge',
  'Paused',
  'Transitioning',
  'Defeat',
  'FinalSequence',
  'DemoEnd',
] as const;

export type GameState = (typeof GAME_STATES)[number];

export const GAME_TRANSITION_EVENTS = [
  'bootComplete',
  'languageConfirmed',
  'startRun',
  'wakeDialogueComplete',
  'dialogueStarted',
  'dialogueComplete',
  'officeExitReached',
  'encounterReady',
  'challengePresented',
  'challengeClosed',
  'manualPauseRequested',
  'safetyPauseRequested',
  'resumeRequested',
  'encounterCompleted',
  'nextEncounterReady',
  'finalSequenceReady',
  'playerDefeated',
  'extractionComplete',
  'restartRequested',
  'exitToMenuRequested',
] as const;

export type GameTransitionEvent = (typeof GAME_TRANSITION_EVENTS)[number];

export type PauseReturnState = 'Exploration' | 'Playing' | 'Challenge';

export interface ChallengePauseSnapshot {
  readonly remainingMs: number;
  readonly typedAnswer: string;
  readonly selectedOptionIndex: number | null;
}

export type PauseContext =
  | {
      readonly cause: 'manual';
      readonly returnState: 'Exploration' | 'Playing';
    }
  | {
      readonly cause: 'visibility';
      readonly returnState: 'Exploration' | 'Playing';
    }
  | {
      readonly cause: 'visibility';
      readonly returnState: 'Challenge';
      readonly challengeSnapshot: ChallengePauseSnapshot;
    };
