import type { EncounterConfig } from '../../combat/EncounterManager';

/**
 * Encounter 4: Boolean Beetle — Logic category (sub-boss).
 * 
 * The hardest playable encounter in the demo.
 * 150 HP requires 6 correct answers (6 × 25 = 150).
 * 4 attacks with staggered intervals create constant pressure.
 * After defeat: finalSequenceReady (not nextEncounterReady).
 */
export const BOOLEAN_BEETLE_ENCOUNTER: EncounterConfig = {
  id: 'boolean-beetle',
  enemySpawns: [
    {
      id: 'beetle-01',
      archetypeId: 'boolean-beetle',
      x: 480,
      y: 200,
      maxHp: 150,
      attackIds: [
        'beetle.booleanBurst',
        'beetle.xorCrossfire',
        'beetle.falsePath',
        'beetle.branchCharge',
      ],
      attackParams: {
        'beetle.booleanBurst': {
          damage: 12,
          projectileSpeed: 130,
          intervalMs: 2500,
          projectilesPerBurst: 3,
        },
        'beetle.xorCrossfire': {
          damage: 10,
          projectileSpeed: 150,
          intervalMs: 3000,
          projectilesPerBurst: 4,
        },
        'beetle.falsePath': {
          damage: 15,
          projectileSpeed: 140,
          intervalMs: 4000,
          projectilesPerBurst: 1,
        },
        'beetle.branchCharge': {
          damage: 20,
          projectileSpeed: 0,
          intervalMs: 6000,
          projectilesPerBurst: 0,
        },
      },
    },
  ],
  challengePool: ['logic-01', 'logic-02', 'logic-03'],
  challengeIntervalMs: 3500,
  defaultTimeLimitMs: 8000,
  damageTargetMode: 'roundRobin',
  completionRule: {
    type: 'allRequiredEnemiesDefeated',
    requiredEnemyIds: ['beetle-01'],
  },
};
