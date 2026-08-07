import { Enemy, type EnemyConfig } from './Enemy';
import type { RunManager } from '../core/RunManager';

export type DamageTargetMode = 'roundRobin' | 'allActive' | 'sharedPool';

export type CompletionRuleType = 'allRequiredEnemiesDefeated' | 'sharedPoolDepleted';

export interface CompletionRule {
  readonly type: CompletionRuleType;
  readonly requiredEnemyIds?: readonly string[];
}

export interface EncounterConfig {
  readonly id: string;
  readonly enemySpawns: readonly EnemyConfig[];
  readonly challengePool: readonly string[];
  readonly challengeIntervalMs: number;
  readonly defaultTimeLimitMs: number;
  readonly damageTargetMode: DamageTargetMode;
  readonly completionRule: CompletionRule;
}

const ENCOUNTER_IDS = ['parse-mantis', 'mutable-widow', 'cast-hornet', 'boolean-beetle'] as const;

export class EncounterManager {
  readonly #encounters: readonly EncounterConfig[];
  readonly #runManager: RunManager;
  #currentIndex = 0;
  #enemies: Enemy[] = [];
  #roundRobinIndex = 0;

  public constructor(encounters: readonly EncounterConfig[], runManager: RunManager) {
    this.#encounters = encounters;
    this.#runManager = runManager;
  }

  public get currentEncounter(): EncounterConfig | undefined {
    return this.#encounters[this.#currentIndex];
  }

  public get currentIndex(): number {
    return this.#currentIndex;
  }

  public get enemies(): readonly Enemy[] {
    return this.#enemies;
  }

  public get activeEnemies(): readonly Enemy[] {
    return this.#enemies.filter((e) => !e.defeated);
  }

  public get isLastEncounter(): boolean {
    return this.#currentIndex >= this.#encounters.length - 1;
  }

  /**
   * Initialize the current encounter: spawn enemies.
   */
  public startEncounter(): readonly Enemy[] {
    const config = this.currentEncounter;
    if (config === undefined) return [];

    this.#enemies = config.enemySpawns.map((spawn) => new Enemy(spawn));
    this.#roundRobinIndex = 0;
    return this.#enemies;
  }

  /**
   * Resolve which enemy receives damage for a Correct Answer.
   */
  public resolveDamageTarget(): Enemy | null {
    const active = this.activeEnemies;
    if (active.length === 0) return null;

    const config = this.currentEncounter;
    if (config === undefined) return null;

    switch (config.damageTargetMode) {
      case 'roundRobin': {
        const target = active[this.#roundRobinIndex % active.length];
        this.#roundRobinIndex++;
        return target ?? null;
      }
      case 'allActive':
        // All enemies take damage — return first; caller applies to all
        return active[0] ?? null;
      case 'sharedPool':
        return active[0] ?? null;
      default:
        return active[0] ?? null;
    }
  }

  /**
   * Check if the encounter is complete per its completionRule.
   */
  public isComplete(): boolean {
    const config = this.currentEncounter;
    if (config === undefined) return false;

    const rule = config.completionRule;
    switch (rule.type) {
      case 'allRequiredEnemiesDefeated': {
        const requiredIds = rule.requiredEnemyIds ?? this.#enemies.map((e) => e.id);
        return requiredIds.every((id) => {
          const enemy = this.#enemies.find((e) => e.id === id);
          return enemy !== undefined && enemy.defeated;
        });
      }
      case 'sharedPoolDepleted':
        return this.#enemies.every((e) => e.defeated);
      default:
        return false;
    }
  }

  /**
   * Advance to the next encounter with healing.
   * Returns false if there are no more encounters.
   */
  public advance(): boolean {
    if (this.isLastEncounter) return false;

    this.#currentIndex++;
    this.#runManager.advanceEncounter();
    this.#runManager.applyHealing();
    this.#enemies = [];
    this.#roundRobinIndex = 0;
    return true;
  }

  /**
   * Clean up for transition (release enemies).
   */
  public cleanup(): void {
    this.#enemies = [];
    this.#roundRobinIndex = 0;
  }

  /**
   * Reset to first encounter.
   */
  public reset(): void {
    this.#currentIndex = 0;
    this.#enemies = [];
    this.#roundRobinIndex = 0;
  }
}
