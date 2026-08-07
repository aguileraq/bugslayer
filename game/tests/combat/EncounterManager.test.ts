import { describe, expect, it } from 'vitest';

import { Enemy } from '../../src/combat/Enemy';
import { EncounterManager, type EncounterConfig } from '../../src/combat/EncounterManager';
import { RunManager } from '../../src/core/RunManager';
import { SessionSettings } from '../../src/core/SessionSettings';

function createEncounters(): readonly EncounterConfig[] {
  return [
    {
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
            'parse.linearAttack': { damage: 10, projectileSpeed: 160, intervalMs: 2000, projectilesPerBurst: 1 },
          },
        },
      ],
      challengePool: ['syntax-01', 'syntax-02', 'syntax-03'],
      challengeIntervalMs: 5000,
      defaultTimeLimitMs: 8000,
      damageTargetMode: 'roundRobin',
      completionRule: { type: 'allRequiredEnemiesDefeated', requiredEnemyIds: ['parse-mantis-01'] },
    },
    {
      id: 'mutable-widow',
      enemySpawns: [
        {
          id: 'widow-01',
          archetypeId: 'mutable-widow',
          x: 300,
          y: 200,
          maxHp: 80,
          attackIds: ['widow.reassignmentVolley'],
          attackParams: {
            'widow.reassignmentVolley': { damage: 8, projectileSpeed: 140, intervalMs: 1800, projectilesPerBurst: 2 },
          },
        },
        {
          id: 'widow-02',
          archetypeId: 'mutable-widow',
          x: 600,
          y: 200,
          maxHp: 80,
          attackIds: ['widow.reassignmentVolley'],
          attackParams: {
            'widow.reassignmentVolley': { damage: 8, projectileSpeed: 140, intervalMs: 1800, projectilesPerBurst: 2 },
          },
        },
      ],
      challengePool: ['variable-01', 'variable-02', 'variable-03'],
      challengeIntervalMs: 4500,
      defaultTimeLimitMs: 8000,
      damageTargetMode: 'roundRobin',
      completionRule: { type: 'allRequiredEnemiesDefeated', requiredEnemyIds: ['widow-01', 'widow-02'] },
    },
  ];
}

function setup() {
  const settings = new SessionSettings();
  settings.setLanguage('es');
  const runManager = new RunManager(settings);
  const encounters = createEncounters();
  const manager = new EncounterManager(encounters, runManager);
  return { manager, runManager, settings };
}

describe('Enemy', () => {
  it('starts at full HP and can be damaged to defeat', () => {
    const enemy = new Enemy({
      id: 'test-01',
      archetypeId: 'parse-mantis',
      x: 100,
      y: 200,
      maxHp: 50,
      attackIds: ['parse.linearAttack'],
      attackParams: { 'parse.linearAttack': { damage: 10, projectileSpeed: 160, intervalMs: 2000, projectilesPerBurst: 1 } },
    });

    expect(enemy.hp).toBe(50);
    expect(enemy.defeated).toBe(false);

    enemy.applyDamage(30);
    expect(enemy.hp).toBe(20);
    expect(enemy.defeated).toBe(false);

    enemy.applyDamage(25);
    expect(enemy.hp).toBe(0);
    expect(enemy.defeated).toBe(true);
  });

  it('ignores damage after defeat', () => {
    const enemy = new Enemy({
      id: 'test-01',
      archetypeId: 'parse-mantis',
      x: 0,
      y: 0,
      maxHp: 10,
      attackIds: [],
      attackParams: {},
    });

    enemy.applyDamage(10);
    expect(enemy.defeated).toBe(true);

    enemy.applyDamage(5);
    expect(enemy.hp).toBe(0);
  });
});

describe('EncounterManager', () => {
  it('starts at encounter index 0 with correct config', () => {
    const { manager } = setup();

    expect(manager.currentIndex).toBe(0);
    expect(manager.currentEncounter?.id).toBe('parse-mantis');
    expect(manager.isLastEncounter).toBe(false);
  });

  it('spawns enemies for the current encounter', () => {
    const { manager } = setup();

    const enemies = manager.startEncounter();
    expect(enemies).toHaveLength(1);
    expect(enemies[0]?.id).toBe('parse-mantis-01');
    expect(enemies[0]?.hp).toBe(100);
    expect(manager.enemies).toHaveLength(1);
    expect(manager.activeEnemies).toHaveLength(1);
  });

  it('detects completion when all required enemies are defeated', () => {
    const { manager } = setup();

    manager.startEncounter();
    expect(manager.isComplete()).toBe(false);

    const enemy = manager.enemies[0]!;
    enemy.applyDamage(100);
    expect(manager.isComplete()).toBe(true);
  });

  it('resolves roundRobin damage target', () => {
    const { manager } = setup();

    // Advance to encounter 2 (2 widows) to test roundRobin
    manager.startEncounter();
    manager.enemies[0]!.applyDamage(100); // defeat parse-mantis
    manager.advance();
    manager.startEncounter();

    const target1 = manager.resolveDamageTarget();
    const target2 = manager.resolveDamageTarget();
    const target3 = manager.resolveDamageTarget();

    expect(target1?.id).toBe('widow-01');
    expect(target2?.id).toBe('widow-02');
    expect(target3?.id).toBe('widow-01'); // wraps around
  });

  it('advances to next encounter with healing', () => {
    const { manager, runManager } = setup();

    runManager.applyDamage(50); // HP = 50
    manager.startEncounter();
    manager.enemies[0]!.applyDamage(100);

    const advanced = manager.advance();
    expect(advanced).toBe(true);
    expect(manager.currentIndex).toBe(1);
    expect(manager.currentEncounter?.id).toBe('mutable-widow');
    expect(runManager.hp).toBe(80); // 50 + 30 (30% of 100)
    expect(runManager.currentEncounterIndex).toBe(1);
  });

  it('does not advance past the last encounter', () => {
    const { manager } = setup();

    manager.startEncounter();
    manager.enemies[0]!.applyDamage(100);
    manager.advance(); // now at index 1 (last)

    expect(manager.isLastEncounter).toBe(true);
    expect(manager.advance()).toBe(false);
    expect(manager.currentIndex).toBe(1);
  });

  it('cleanup clears enemies', () => {
    const { manager } = setup();

    manager.startEncounter();
    expect(manager.enemies).toHaveLength(1);

    manager.cleanup();
    expect(manager.enemies).toHaveLength(0);
  });

  it('reset returns to first encounter', () => {
    const { manager } = setup();

    manager.startEncounter();
    manager.enemies[0]!.applyDamage(100);
    manager.advance();

    manager.reset();
    expect(manager.currentIndex).toBe(0);
    expect(manager.currentEncounter?.id).toBe('parse-mantis');
    expect(manager.enemies).toHaveLength(0);
  });

  it('returns null target when no active enemies', () => {
    const { manager } = setup();

    manager.startEncounter();
    manager.enemies[0]!.applyDamage(100);

    expect(manager.resolveDamageTarget()).toBeNull();
  });
});
