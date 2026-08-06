import type { LocalizationKey } from './localization';
import type { NonEmptyReadonlyArray } from './primitives';

export const CHALLENGE_CATEGORIES = [
  'syntax',
  'variable',
  'type',
  'logic',
] as const;

export type ChallengeCategory = (typeof CHALLENGE_CATEGORIES)[number];

export const CHALLENGE_MODES = ['typed', 'multiple-choice'] as const;

export type ChallengeMode = (typeof CHALLENGE_MODES)[number];

export type ChallengeId = string;

interface BaseChallenge<M extends ChallengeMode> {
  readonly id: ChallengeId;
  readonly category: ChallengeCategory;
  readonly mode: M;
  readonly code: string;
  readonly instructionKey: LocalizationKey;
  readonly damage: number;
  readonly timeLimitMs: number;
}

export interface TypedChallenge extends BaseChallenge<'typed'> {
  readonly acceptedAnswers: NonEmptyReadonlyArray<string>;
  readonly caseSensitive?: boolean;
}

export type MultipleChoiceOptions =
  | readonly [string, string, string]
  | readonly [string, string, string, string];

export interface MultipleChoiceChallenge
  extends BaseChallenge<'multiple-choice'> {
  readonly options: MultipleChoiceOptions;
  readonly correctIndex: 0 | 1 | 2 | 3;
}

export type Challenge = TypedChallenge | MultipleChoiceChallenge;
