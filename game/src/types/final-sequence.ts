import type { AssetKey } from './assets';
import type { LocalizationKey } from './localization';
import type { NonEmptyReadonlyArray } from './primitives';

export const FINAL_SEQUENCE_STEP_TYPES = [
  'dialogue',
  'environmentCorruption',
  'actorAppearance',
  'enemyInfection',
  'minionAppearance',
  'warning',
  'extractionLockOn',
  'actorExtraction',
  'fade',
  'demoEndTransition',
] as const;

export type FinalSequenceStepType =
  (typeof FINAL_SEQUENCE_STEP_TYPES)[number];

export const FINAL_SEQUENCE_ACTOR_IDS = [
  'senior-engineer',
  'v4lk',
  'mycelial-monolith',
  'boolean-beetle',
  'parse-mantis-infected',
  'mutable-widow-infected',
  'cast-hornet-infected',
  'boolean-beetle-infected',
] as const;

export type FinalSequenceActorId =
  (typeof FINAL_SEQUENCE_ACTOR_IDS)[number];

export interface FinalSequenceStep {
  readonly id: string;
  readonly type: FinalSequenceStepType;
  readonly actorIds: readonly FinalSequenceActorId[];
  readonly effectKey?: AssetKey;
  readonly dialogueKey?: LocalizationKey;
  readonly durationMs?: number;
  readonly completionSignal?: string;
}

export interface FinalSequenceConfig {
  readonly steps: NonEmptyReadonlyArray<FinalSequenceStep>;
  readonly terminalState: 'DemoEnd';
}
