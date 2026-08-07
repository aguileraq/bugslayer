import { describe, expect, it } from 'vitest';

import { EncounterManager, type EncounterConfig } from '../../src/combat/EncounterManager';
import { AttackPatternRegistry } from '../../src/combat/AttackPatternRegistry';
import { RunManager } from '../../src/core/RunManager';
import { SessionSettings } from '../../src/core/SessionSettings';
import { PARSE_MANTIS_ENCOUNTER } from '../../src/data/encounters/parse-mantis';
import { MUTABLE_WIDOW_ENCOUNTER } from '../../src/data/encounters/mutable-widow';
import { CAST_HORNET_ENCOUNTER } from '../../src/data/encounters/cast-hornet';
import { BOOLEAN_BEETLE_ENCOUNTER } from '../../src/data/encounters/boolean-beetle';

const ALL_ENCOUNTERS: readonly EncounterConfig[] = [
  PARSE_MANTIS_ENCOUNTER,
  MUTABLE_WIDOW_ENCOUNTER,
  CAST_HORNET_ENCOUNTER,
  BOOLEAN_BEETLE_ENCOUNTER,
];

function setup() {
  const settings = new SessionSettings();
  settings.setLanguage('es');
  const runManager = new RunManager(settings);
  const encounterManager = new EncounterManager(ALL_ENCOUNTERS, runManager);
  const registry = new AttackPatternRegistry();
  return { runManager, encounterManager, registry, settings };
}

function defeatAllEnemies(encounterManager: EncounterManager): void {
  for (const enemy of encounterManager.enemies) {
    enemy.applyDamage(enemy.maxHp);
  }
}

describe('Four Encounters — Full Progression', () => {
  it('completes all 4 encounters in order with correct IDs', () => {
    const { encounterManager } = setup();

    // Encounter 1: Parse Mantis
    expect(encounterManager.currentEncounter?.id).toBe('parse-mantis');
    encounterManager.startEncounter();
    expect(encounterManager.enemies).toHaveLength(1);
    defeatAllEnemies(encounterManager);
    expect(encounterManager.isComplete()).toBe(true);
    expect(encounterManager.advance()).toBe(true);

    // Encounter 2: Mutable Widow
    expect(encounterManager.currentEncounter?.id).toBe('mutable-widow');
    encounterManager.startEncounter();
    expect(encounterManager.enemies).toHaveLength(2);
    defeatAllEnemies(encounterManager);
    expect(encounterManager.isComplete()).toBe(true);
    expect(encounterManager.advance()).toBe(true);

    // Encounter 3: Cast Hornet
    expect(encounterManager.currentEncounter?.id).toBe('cast-hornet');
    encounterManager.startEncounter();
    expect(encounterManager.enemies).toHaveLength(3);
    defeatAllEnemies(encounterManager);
    expect(encounterManager.isComplete()).toBe(true);
    expect(encounterManager.advance()).toBe(true);

    // Encounter 4: Boolean Beetle
    expect(encounterManager.currentEncounter?.id).toBe('boolean-beetle');
    encounterManager.startEncounter();
    expect(encounterManager.enemies).toHaveLength(1);
    expect(encounterManager.enemies[0]?.maxHp).toBe(150);
    defeatAllEnemies(encounterManager);
    expect(encounterManager.isComplete()).toBe(true);
  });

  it('Boolean Beetle is the last encounter — advance returns false', () => {
    const { encounterManager } = setup();

    // Fast-forward through 3 encounters
    for (let i = 0; i < 3; i++) {
      encounterManager.startEncounter();
      defeatAllEnemies(encounterManager);
      encounterManager.advance();
    }

    // At Boolean Beetle
    expect(encounterManager.currentEncounter?.id).toBe('boolean-beetle');
    expect(encounterManager.isLastEncounter).toBe(true);

    encounterManager.startEncounter();
    defeatAllEnemies(encounterManager);
    expect(encounterManager.isComplete()).toBe(true);

    // Cannot advance — triggers finalSequenceReady instead
    expect(encounterManager.advance()).toBe(false);
  });

  it('applies healing between each encounter (30% capped)', () => {
    const { runManager, encounterManager } = setup();

    // Take 70 damage during E1
    runManager.applyDamage(70); // HP: 30
    encounterManager.startEncounter();
    defeatAllEnemies(encounterManager);
    encounterManager.advance();
    expect(runManager.hp).toBe(60); // 30 + 30

    // Take 20 damage during E2
    runManager.applyDamage(20); // HP: 40
    encounterManager.startEncounter();
    defeatAllEnemies(encounterManager);
    encounterManager.advance();
    expect(runManager.hp).toBe(70); // 40 + 30

    // Take 0 damage during E3 (full HP scenario)
    runManager.applyDamage(0);
    encounterManager.startEncounter();
    defeatAllEnemies(encounterManager);
    encounterManager.advance();
    expect(runManager.hp).toBe(100); // 70 + 30 = 100 (capped at max)
  });

  it('preserves Score and Streak across all 4 encounters', () => {
    const { runManager, encounterManager } = setup();

    // Build score across encounters
    runManager.applyCorrect(5000); // E1: +160, streak 1
    encounterManager.startEncounter();
    defeatAllEnemies(encounterManager);
    encounterManager.advance();

    runManager.applyCorrect(4000); // E2: +160, streak 2
    encounterManager.startEncounter();
    defeatAllEnemies(encounterManager);
    encounterManager.advance();

    runManager.applyCorrect(3000); // E3: +160, streak 3
    encounterManager.startEncounter();
    defeatAllEnemies(encounterManager);
    encounterManager.advance();

    // Score preserved through all transitions
    expect(runManager.streak).toBe(3);
    expect(runManager.maxStreak).toBe(3);
    expect(runManager.score).toBeGreaterThan(0);
    expect(runManager.correctCount).toBe(3);
  });

  it('each encounter has the correct challenge category pool', () => {
    const { encounterManager } = setup();

    expect(encounterManager.currentEncounter?.challengePool).toEqual(
      ['syntax-01', 'syntax-02', 'syntax-03'],
    );

    encounterManager.startEncounter();
    defeatAllEnemies(encounterManager);
    encounterManager.advance();

    expect(encounterManager.currentEncounter?.challengePool).toEqual(
      ['variable-01', 'variable-02', 'variable-03'],
    );

    encounterManager.startEncounter();
    defeatAllEnemies(encounterManager);
    encounterManager.advance();

    expect(encounterManager.currentEncounter?.challengePool).toEqual(
      ['type-01', 'type-02', 'type-03'],
    );

    encounterManager.startEncounter();
    defeatAllEnemies(encounterManager);
    encounterManager.advance();

    expect(encounterManager.currentEncounter?.challengePool).toEqual(
      ['logic-01', 'logic-02', 'logic-03'],
    );
  });

  it('all 9 attack patterns are registered and executable', () => {
    const { registry } = setup();

    const allPatterns = [
      'parse.linearAttack',
      'widow.reassignmentVolley',
      'widow.scopeWeb',
      'hornet.typeSting',
      'hornet.castingSwarm',
      'beetle.booleanBurst',
      'beetle.xorCrossfire',
      'beetle.falsePath',
      'beetle.branchCharge',
    ];

    for (const pattern of allPatterns) {
      expect(registry.has(pattern)).toBe(true);
    }
  });

  it('Boolean Beetle requires 6 correct answers to defeat (6×25=150)', () => {
    const { encounterManager } = setup();

    // Fast-forward to Beetle
    for (let i = 0; i < 3; i++) {
      encounterManager.startEncounter();
      defeatAllEnemies(encounterManager);
      encounterManager.advance();
    }

    encounterManager.startEncounter();
    const beetle = encounterManager.enemies[0]!;
    expect(beetle.maxHp).toBe(150);

    // 5 hits not enough
    for (let i = 0; i < 5; i++) {
      beetle.applyDamage(25);
    }
    expect(beetle.hp).toBe(25);
    expect(beetle.defeated).toBe(false);
    expect(encounterManager.isComplete()).toBe(false);

    // 6th hit defeats
    beetle.applyDamage(25);
    expect(beetle.hp).toBe(0);
    expect(beetle.defeated).toBe(true);
    expect(encounterManager.isComplete()).toBe(true);
  });

  it('statistics reflect full progression through all encounters', () => {
    const { runManager, encounterManager } = setup();

    // Simulate full run
    for (let i = 0; i < 4; i++) {
      runManager.applyCorrect(5000);
      runManager.advanceTime(30000);
      encounterManager.startEncounter();
      defeatAllEnemies(encounterManager);
      if (i < 3) encounterManager.advance();
    }

    const stats = runManager.statistics();
    expect(stats.correctCount).toBe(4);
    expect(stats.totalPlayTimeMs).toBe(120000);
    expect(stats.furthestEncounterId).toBe('boolean-beetle');
    expect(stats.maxStreak).toBe(4);
  });
});
