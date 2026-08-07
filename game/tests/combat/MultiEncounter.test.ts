import { describe, expect, it } from 'vitest';

import { EncounterManager, type EncounterConfig } from '../../src/combat/EncounterManager';
import { PenaltyManager } from '../../src/combat/PenaltyManager';
import { ProjectilePool } from '../../src/combat/ProjectilePool';
import { RunManager } from '../../src/core/RunManager';
import { SessionSettings } from '../../src/core/SessionSettings';
import { PARSE_MANTIS_ENCOUNTER } from '../../src/data/encounters/parse-mantis';
import { MUTABLE_WIDOW_ENCOUNTER } from '../../src/data/encounters/mutable-widow';
import { CAST_HORNET_ENCOUNTER } from '../../src/data/encounters/cast-hornet';

const ALL_ENCOUNTERS: readonly EncounterConfig[] = [
  PARSE_MANTIS_ENCOUNTER,
  MUTABLE_WIDOW_ENCOUNTER,
  CAST_HORNET_ENCOUNTER,
];

function setup() {
  const settings = new SessionSettings();
  settings.setLanguage('es');
  const runManager = new RunManager(settings);
  const encounterManager = new EncounterManager(ALL_ENCOUNTERS, runManager);
  const penaltyManager = new PenaltyManager();
  const pool = new ProjectilePool(200);
  return { runManager, encounterManager, penaltyManager, pool, settings };
}

describe('Multi-Encounter Integration', () => {
  describe('roundRobin targeting with 2 enemies (Mutable Widow)', () => {
    it('alternates damage between both Widows', () => {
      const { encounterManager, runManager } = setup();

      // Advance to Encounter 2
      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(100); // defeat parse-mantis
      encounterManager.advance();
      encounterManager.startEncounter();

      const enemies = encounterManager.enemies;
      expect(enemies).toHaveLength(2);

      // Simulate 4 correct answers with roundRobin
      for (let i = 0; i < 4; i++) {
        const target = encounterManager.resolveDamageTarget();
        expect(target).not.toBeNull();
        target!.applyDamage(25);
        runManager.applyCorrect(5000);
      }

      // After 4 hits (2 per widow): widow-01 has 30 HP, widow-02 has 30 HP
      expect(enemies[0]!.hp).toBe(30);
      expect(enemies[1]!.hp).toBe(30);
    });

    it('skips defeated enemies in roundRobin', () => {
      const { encounterManager } = setup();

      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(100);
      encounterManager.advance();
      encounterManager.startEncounter();

      const enemies = encounterManager.enemies;

      // Defeat widow-01 manually
      enemies[0]!.applyDamage(80);
      expect(enemies[0]!.defeated).toBe(true);

      // Now all targets should be widow-02
      const target1 = encounterManager.resolveDamageTarget();
      const target2 = encounterManager.resolveDamageTarget();
      expect(target1?.id).toBe('widow-02');
      expect(target2?.id).toBe('widow-02');
    });

    it('completes only when both Widows are defeated', () => {
      const { encounterManager } = setup();

      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(100);
      encounterManager.advance();
      encounterManager.startEncounter();

      const enemies = encounterManager.enemies;

      enemies[0]!.applyDamage(80);
      expect(encounterManager.isComplete()).toBe(false);

      enemies[1]!.applyDamage(80);
      expect(encounterManager.isComplete()).toBe(true);
    });
  });

  describe('roundRobin targeting with 3 enemies (Cast Hornet)', () => {
    it('cycles through all 3 Hornets', () => {
      const { encounterManager } = setup();

      // Advance to Encounter 3
      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(100);
      encounterManager.advance();
      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(80);
      encounterManager.enemies[1]!.applyDamage(80);
      encounterManager.advance();
      encounterManager.startEncounter();

      const enemies = encounterManager.enemies;
      expect(enemies).toHaveLength(3);

      const target1 = encounterManager.resolveDamageTarget();
      const target2 = encounterManager.resolveDamageTarget();
      const target3 = encounterManager.resolveDamageTarget();
      const target4 = encounterManager.resolveDamageTarget();

      expect(target1?.id).toBe('hornet-01');
      expect(target2?.id).toBe('hornet-02');
      expect(target3?.id).toBe('hornet-03');
      expect(target4?.id).toBe('hornet-01'); // wraps
    });

    it('reduces pressure as each Hornet is defeated', () => {
      const { encounterManager } = setup();

      // Fast-forward to Encounter 3
      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(100);
      encounterManager.advance();
      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(80);
      encounterManager.enemies[1]!.applyDamage(80);
      encounterManager.advance();
      encounterManager.startEncounter();

      const enemies = encounterManager.enemies;

      // Defeat hornet-01
      enemies[0]!.applyDamage(60);
      expect(encounterManager.activeEnemies).toHaveLength(2);

      // RoundRobin should now only target hornet-02 and hornet-03
      const t1 = encounterManager.resolveDamageTarget();
      const t2 = encounterManager.resolveDamageTarget();
      expect(t1?.id).toBe('hornet-02');
      expect(t2?.id).toBe('hornet-03');

      // Defeat hornet-02
      enemies[1]!.applyDamage(60);
      expect(encounterManager.activeEnemies).toHaveLength(1);

      // Only hornet-03 left
      const t3 = encounterManager.resolveDamageTarget();
      expect(t3?.id).toBe('hornet-03');
    });

    it('completes only when all 3 Hornets are defeated', () => {
      const { encounterManager } = setup();

      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(100);
      encounterManager.advance();
      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(80);
      encounterManager.enemies[1]!.applyDamage(80);
      encounterManager.advance();
      encounterManager.startEncounter();

      const enemies = encounterManager.enemies;
      enemies[0]!.applyDamage(60);
      enemies[1]!.applyDamage(60);
      expect(encounterManager.isComplete()).toBe(false);

      enemies[2]!.applyDamage(60);
      expect(encounterManager.isComplete()).toBe(true);
    });
  });

  describe('transitions between encounters', () => {
    it('applies 30% healing (capped) when advancing', () => {
      const { runManager, encounterManager } = setup();

      // Take damage during Encounter 1
      runManager.applyDamage(60); // HP: 40
      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(100);

      encounterManager.advance();
      // Healing: 40 + 30 = 70
      expect(runManager.hp).toBe(70);

      // Take more damage
      runManager.applyDamage(20); // HP: 50
      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(80);
      encounterManager.enemies[1]!.applyDamage(80);

      encounterManager.advance();
      // Healing: 50 + 30 = 80
      expect(runManager.hp).toBe(80);
    });

    it('preserves Score and Streak across encounters', () => {
      const { runManager, encounterManager } = setup();

      // Build score and streak in Encounter 1
      runManager.applyCorrect(5000); // score: 160, streak: 1
      runManager.applyCorrect(4000); // score: 160+150=310, streak: 2

      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(100);
      encounterManager.advance();

      // Score and streak remain after transition
      expect(runManager.score).toBe(310);
      expect(runManager.streak).toBe(2);
      expect(runManager.maxStreak).toBe(2);
    });

    it('cancels penalty and clears projectiles on transition', () => {
      const { penaltyManager, pool } = setup();

      // Activate penalty and spawn projectiles
      penaltyManager.activate();
      pool.acquire({ x: 100, y: 100, velocityX: 100, velocityY: 0, damage: 10, key: 'test' });
      pool.acquire({ x: 200, y: 200, velocityX: -50, velocityY: 50, damage: 5, key: 'test' });

      expect(penaltyManager.active).toBe(true);
      expect(pool.activeCount).toBe(2);

      // Simulate transition cleanup
      penaltyManager.cancel();
      pool.releaseAll();

      expect(penaltyManager.active).toBe(false);
      expect(pool.activeCount).toBe(0);
    });
  });

  describe('full run progression', () => {
    it('tracks encounter index through all 3 encounters', () => {
      const { runManager, encounterManager } = setup();

      expect(runManager.currentEncounterIndex).toBe(0);
      expect(encounterManager.currentEncounter?.id).toBe('parse-mantis');

      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(100);
      encounterManager.advance();

      expect(runManager.currentEncounterIndex).toBe(1);
      expect(encounterManager.currentEncounter?.id).toBe('mutable-widow');

      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(80);
      encounterManager.enemies[1]!.applyDamage(80);
      encounterManager.advance();

      expect(runManager.currentEncounterIndex).toBe(2);
      expect(encounterManager.currentEncounter?.id).toBe('cast-hornet');
      expect(encounterManager.isLastEncounter).toBe(true);
    });

    it('cannot advance past the last encounter', () => {
      const { encounterManager } = setup();

      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(100);
      encounterManager.advance();
      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(80);
      encounterManager.enemies[1]!.applyDamage(80);
      encounterManager.advance();

      expect(encounterManager.isLastEncounter).toBe(true);
      expect(encounterManager.advance()).toBe(false);
    });

    it('statistics reflect furthest encounter reached', () => {
      const { runManager, encounterManager } = setup();

      runManager.applyCorrect(3000);
      runManager.advanceTime(30000);

      encounterManager.startEncounter();
      encounterManager.enemies[0]!.applyDamage(100);
      encounterManager.advance();

      const stats = runManager.statistics();
      expect(stats.furthestEncounterId).toBe('mutable-widow');
      expect(stats.correctCount).toBe(1);
      expect(stats.totalPlayTimeMs).toBe(30000);
    });
  });
});
