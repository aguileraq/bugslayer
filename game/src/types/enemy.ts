import type { AssetKey } from './assets';
import type { LocalizationKey } from './localization';

export const ENEMY_ARCHETYPE_IDS = [
  'parse-mantis',
  'mutable-widow',
  'cast-hornet',
  'boolean-beetle',
] as const;

export type EnemyArchetypeId = (typeof ENEMY_ARCHETYPE_IDS)[number];

export type EnemyInstanceId = string;

export type EnemyDirection = 'down' | 'left' | 'right' | 'up';

export type EnemyMovementMode = 'ground' | 'flying' | 'heavy';

export interface EnemyArchetypeConfig {
  readonly id: EnemyArchetypeId;
  readonly displayNameKey: LocalizationKey;
  readonly movementMode: EnemyMovementMode;
  readonly spriteAssetKey: AssetKey;
}

export interface EnemyStateSnapshot {
  readonly id: EnemyInstanceId;
  readonly archetypeId: EnemyArchetypeId;
  readonly hp: number;
  readonly maxHp: number;
  readonly direction: EnemyDirection;
  readonly activeAttackId: string | null;
  readonly defeated: boolean;
}
