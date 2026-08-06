import type { AssetKey } from './assets';
import type { ChallengeCategory, ChallengeId } from './challenge';
import type { EnemyArchetypeId, EnemyInstanceId } from './enemy';
import type { LocalizationKey } from './localization';
import type {
  JsonObject,
  NonEmptyReadonlyArray,
  Vector2Data,
} from './primitives';

export const ENCOUNTER_ORDER = [
  'parse-mantis',
  'mutable-widow',
  'cast-hornet',
  'boolean-beetle',
] as const;

export type EncounterId = (typeof ENCOUNTER_ORDER)[number];

export const ATTACK_PATTERN_IDS = [
  'parse.linearAttack',
  'widow.reassignmentVolley',
  'widow.scopeWeb',
  'hornet.typeSting',
  'hornet.castingSwarm',
  'beetle.booleanBurst',
  'beetle.xorCrossfire',
  'beetle.falsePath',
  'beetle.branchCharge',
] as const;

export type AttackPatternId = (typeof ATTACK_PATTERN_IDS)[number];

export type AttackParameters = Readonly<
  {
    readonly damage: number;
  } & JsonObject
>;

export interface EnemySpawnConfig {
  readonly id: EnemyInstanceId;
  readonly archetypeId: EnemyArchetypeId;
  readonly position: Vector2Data;
  readonly maxHp: number;
  readonly attackIds: NonEmptyReadonlyArray<AttackPatternId>;
  readonly attackParams: Readonly<
    Partial<Record<AttackPatternId, AttackParameters>>
  >;
}

export const DAMAGE_TARGET_MODES = [
  'roundRobin',
  'allActive',
  'sharedPool',
] as const;

export type DamageTargetMode = (typeof DAMAGE_TARGET_MODES)[number];

export type EncounterCompletionRule =
  | {
      readonly type: 'allRequiredEnemiesDefeated';
      readonly requiredEnemyIds: NonEmptyReadonlyArray<EnemyInstanceId>;
    }
  | {
      readonly type: 'sharedPoolDepleted';
      readonly memberEnemyIds: NonEmptyReadonlyArray<EnemyInstanceId>;
      readonly sharedMaxHp: number;
    };

export interface ExtraProjectilesPenaltyConfig {
  readonly type: 'extraProjectiles';
  readonly multiplier: number;
  readonly durationMs: number;
}

export type PenaltyConfig = ExtraProjectilesPenaltyConfig;

export interface TutorialConfig {
  readonly stepKeys: NonEmptyReadonlyArray<LocalizationKey>;
}

export interface EncounterConfig {
  readonly id: EncounterId;
  readonly mapKey: AssetKey;
  readonly category: ChallengeCategory;
  readonly enemySpawns: NonEmptyReadonlyArray<EnemySpawnConfig>;
  readonly challengePool: NonEmptyReadonlyArray<ChallengeId>;
  readonly challengeIntervalMs: number;
  readonly defaultTimeLimitMs: number;
  readonly penalty: PenaltyConfig;
  readonly damageTargetMode: DamageTargetMode;
  readonly completionRule: EncounterCompletionRule;
  readonly transitionTextKey: LocalizationKey;
  readonly tutorial?: TutorialConfig;
}
