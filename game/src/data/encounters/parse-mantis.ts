import type { EncounterConfig } from '../../combat/EncounterManager';

export const PARSE_MANTIS_ENCOUNTER: EncounterConfig = {
  id: 'parse-mantis',
  enemySpawns: [
    {
      id: 'parse-mantis-01',
      archetypeId: 'parse-mantis',
      x: 640,
      y: 270,
      maxHp: 100,
      attackIds: ['parse.linearAttack'],
      attackParams: {
        'parse.linearAttack': {
          damage: 10,
          projectileSpeed: 160,
          intervalMs: 2000,
          projectilesPerBurst: 1,
        },
      },
    },
  ],
  challengePool: ['syntax-01', 'syntax-02', 'syntax-03'],
  challengeIntervalMs: 5000,
  defaultTimeLimitMs: 8000,
  damageTargetMode: 'roundRobin',
  completionRule: {
    type: 'allRequiredEnemiesDefeated',
    requiredEnemyIds: ['parse-mantis-01'],
  },
};
