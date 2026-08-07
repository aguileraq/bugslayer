import type { EncounterConfig } from '../../combat/EncounterManager';

/**
 * Encounter 3: Cast Hornet — Type category.
 * 
 * damageTargetMode: roundRobin
 * Decision: Each Correct Answer damages the next active Hornet in sequence.
 * With 3 flying enemies, roundRobin distributes damage evenly so the player
 * can't ignore any one Hornet. As each is defeated the attack pressure
 * reduces proportionally, rewarding consistent correct answers.
 */
export const CAST_HORNET_ENCOUNTER: EncounterConfig = {
  id: 'cast-hornet',
  enemySpawns: [
    {
      id: 'hornet-01',
      archetypeId: 'cast-hornet',
      x: 240,
      y: 150,
      maxHp: 60,
      attackIds: ['hornet.typeSting', 'hornet.castingSwarm'],
      attackParams: {
        'hornet.typeSting': {
          damage: 12,
          projectileSpeed: 200,
          intervalMs: 2500,
          projectilesPerBurst: 1,
        },
        'hornet.castingSwarm': {
          damage: 6,
          projectileSpeed: 120,
          intervalMs: 3500,
          projectilesPerBurst: 3,
        },
      },
    },
    {
      id: 'hornet-02',
      archetypeId: 'cast-hornet',
      x: 480,
      y: 120,
      maxHp: 60,
      attackIds: ['hornet.typeSting', 'hornet.castingSwarm'],
      attackParams: {
        'hornet.typeSting': {
          damage: 12,
          projectileSpeed: 200,
          intervalMs: 2800,
          projectilesPerBurst: 1,
        },
        'hornet.castingSwarm': {
          damage: 6,
          projectileSpeed: 120,
          intervalMs: 3800,
          projectilesPerBurst: 3,
        },
      },
    },
    {
      id: 'hornet-03',
      archetypeId: 'cast-hornet',
      x: 720,
      y: 160,
      maxHp: 60,
      attackIds: ['hornet.typeSting', 'hornet.castingSwarm'],
      attackParams: {
        'hornet.typeSting': {
          damage: 12,
          projectileSpeed: 200,
          intervalMs: 3000,
          projectilesPerBurst: 1,
        },
        'hornet.castingSwarm': {
          damage: 6,
          projectileSpeed: 120,
          intervalMs: 4000,
          projectilesPerBurst: 3,
        },
      },
    },
  ],
  challengePool: ['type-01', 'type-02', 'type-03'],
  challengeIntervalMs: 4000,
  defaultTimeLimitMs: 8000,
  damageTargetMode: 'roundRobin',
  completionRule: {
    type: 'allRequiredEnemiesDefeated',
    requiredEnemyIds: ['hornet-01', 'hornet-02', 'hornet-03'],
  },
};
