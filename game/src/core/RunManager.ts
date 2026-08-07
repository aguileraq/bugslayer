import type { Language, RunStatistics } from '../types';
import type { GameStateMachine } from './GameStateMachine';
import type { SessionSettings } from './SessionSettings';

export interface RunState {
  readonly hp: number;
  readonly maxHp: number;
  readonly score: number;
  readonly streak: number;
  readonly maxStreak: number;
  readonly correctCount: number;
  readonly incorrectCount: number;
  readonly elapsedRunMs: number;
  readonly currentEncounterIndex: number;
  readonly locked: boolean;
}

export interface RunManagerConfig {
  readonly maxHp: number;
  readonly healingFraction: number;
}

const DEFAULT_CONFIG: RunManagerConfig = {
  maxHp: 100,
  healingFraction: 0.3,
};

export class RunManager {
  readonly #config: RunManagerConfig;
  readonly #settings: SessionSettings;
  #hp: number;
  #maxHp: number;
  #score = 0;
  #streak = 0;
  #maxStreak = 0;
  #correctCount = 0;
  #incorrectCount = 0;
  #elapsedRunMs = 0;
  #currentEncounterIndex = 0;
  #locked = false;

  public constructor(settings: SessionSettings, config: Partial<RunManagerConfig> = {}) {
    this.#config = { ...DEFAULT_CONFIG, ...config };
    this.#settings = settings;
    this.#maxHp = this.#config.maxHp;
    this.#hp = this.#maxHp;
  }

  // ─── Getters ───────────────────────────────────────────────

  public get hp(): number {
    return this.#hp;
  }

  public get maxHp(): number {
    return this.#maxHp;
  }

  public get score(): number {
    return this.#score;
  }

  public get streak(): number {
    return this.#streak;
  }

  public get maxStreak(): number {
    return this.#maxStreak;
  }

  public get correctCount(): number {
    return this.#correctCount;
  }

  public get incorrectCount(): number {
    return this.#incorrectCount;
  }

  public get elapsedRunMs(): number {
    return this.#elapsedRunMs;
  }

  public get currentEncounterIndex(): number {
    return this.#currentEncounterIndex;
  }

  public get locked(): boolean {
    return this.#locked;
  }

  public get language(): Language | null {
    return this.#settings.language;
  }

  public get state(): RunState {
    return {
      hp: this.#hp,
      maxHp: this.#maxHp,
      score: this.#score,
      streak: this.#streak,
      maxStreak: this.#maxStreak,
      correctCount: this.#correctCount,
      incorrectCount: this.#incorrectCount,
      elapsedRunMs: this.#elapsedRunMs,
      currentEncounterIndex: this.#currentEncounterIndex,
      locked: this.#locked,
    };
  }

  // ─── Score and Streak ──────────────────────────────────────

  public applyCorrect(remainingMs: number): void {
    if (this.#locked) return;
    this.#streak += 1;
    if (this.#streak > this.#maxStreak) {
      this.#maxStreak = this.#streak;
    }
    this.#score += 100 + Math.floor(remainingMs / 100) + this.#streak * 10;
    this.#correctCount += 1;
  }

  public applyIncorrect(): void {
    if (this.#locked) return;
    this.#score = Math.max(this.#score - 50, 0);
    this.#streak = 0;
    this.#incorrectCount += 1;
  }

  // ─── HP ────────────────────────────────────────────────────

  public applyDamage(amount: number): void {
    if (this.#locked) return;
    this.#hp = Math.max(this.#hp - amount, 0);
  }

  public applyHealing(): void {
    if (this.#locked) return;
    const healing = Math.floor(this.#maxHp * this.#config.healingFraction);
    this.#hp = Math.min(this.#hp + healing, this.#maxHp);
  }

  public get isDefeated(): boolean {
    return this.#hp <= 0;
  }

  // ─── Encounter progression ─────────────────────────────────

  public advanceEncounter(): void {
    this.#currentEncounterIndex += 1;
  }

  // ─── Time ──────────────────────────────────────────────────

  public advanceTime(deltaMs: number): void {
    if (this.#locked) return;
    this.#elapsedRunMs += deltaMs;
  }

  // ─── Lock (on defeat) ─────────────────────────────────────

  public lock(): void {
    this.#locked = true;
  }

  // ─── Statistics snapshot ───────────────────────────────────

  public statistics(): RunStatistics {
    const encounterIds = ['parse-mantis', 'mutable-widow', 'cast-hornet', 'boolean-beetle'] as const;
    const furthest = encounterIds[this.#currentEncounterIndex] ?? null;
    return {
      finalScore: this.#score,
      correctCount: this.#correctCount,
      incorrectCount: this.#incorrectCount,
      maxStreak: this.#maxStreak,
      totalPlayTimeMs: this.#elapsedRunMs,
      furthestEncounterId: furthest,
    };
  }

  // ─── Reset ─────────────────────────────────────────────────

  public restart(): void {
    this.#hp = this.#maxHp;
    this.#score = 0;
    this.#streak = 0;
    this.#maxStreak = 0;
    this.#correctCount = 0;
    this.#incorrectCount = 0;
    this.#elapsedRunMs = 0;
    this.#currentEncounterIndex = 0;
    this.#locked = false;
    // Language is preserved via SessionSettings (not modified)
  }
}
