import type { EncounterConfig } from '../../combat/EncounterManager';

/**
 * Encounter 2: Mutable Widow — Variable category.
 * 
 * damageTargetMode: roundRobin
 * Decision: Each Correct Answer damages the next active Widow in sequence.
 * This creates balanced attrition — both Widows must be managed simultaneously.
 * The player cannot focus-fire a single enemy; instead they whittle both down,
 * maintaining the territorial pressure that defines this encounter.
 */
export const MUTABLE_WIDOW_ENCOUNTER: EncounterConfig = {
  id: 'mutable-widow',
  enemySpawns: [
    {
      id: 'widow-01',
      archetypeId: 'mutable-widow',
      x: 300,
      y: 200,
      maxHp: 80,
      attackIds: ['widow.reassignmentVolley', 'widow.scopeWeb'],
      attackParams: {
        'widow.reassignmentVolley': {
          damage: 8,
          projectileSpeed: 140,
          intervalMs: 1800,
          projectilesPerBurst: 2,
        },
        'widow.scopeWeb': {
          damage: 5,
          projectileSpeed: 80,
          intervalMs: 4000,
          projectilesPerBurst: 1,
        },
      },
    },
    {
      id: 'widow-02',
      archetypeId: 'mutable-widow',
      x: 660,
      y: 200,
      maxHp: 80,
      attackIds: ['widow.reassignmentVolley', 'widow.scopeWeb'],
      attackParams: {
        'widow.reassignmentVolley': {
          damage: 8,
          projectileSpeed: 140,
          intervalMs: 2200,
          projectilesPerBurst: 2,
        },
        'widow.scopeWeb': {
          damage: 5,
          projectileSpeed: 80,
          intervalMs: 4500,
          projectilesPerBurst: 1,
        },
      },
    },
  ],
  challengePool: ['variable-01', 'variable-02', 'variable-03'],
  challengeIntervalMs: 4500,
  defaultTimeLimitMs: 8000,
  damageTargetMode: 'roundRobin',
  completionRule: {
    type: 'allRequiredEnemiesDefeated',
    requiredEnemyIds: ['widow-01', 'widow-02'],
  },
};
