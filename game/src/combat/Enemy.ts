import type { AttackParameters } from './AttackPatternRegistry';

export interface EnemyConfig {
  readonly id: string;
  readonly archetypeId: string;
  readonly x: number;
  readonly y: number;
  readonly maxHp: number;
  readonly attackIds: readonly string[];
  readonly attackParams: Readonly<Record<string, AttackParameters>>;
}

export class Enemy {
  readonly #id: string;
  readonly #archetypeId: string;
  #x: number;
  #y: number;
  #hp: number;
  readonly #maxHp: number;
  readonly #attackIds: readonly string[];
  readonly #attackParams: Readonly<Record<string, AttackParameters>>;
  #defeated = false;

  public constructor(config: EnemyConfig) {
    this.#id = config.id;
    this.#archetypeId = config.archetypeId;
    this.#x = config.x;
    this.#y = config.y;
    this.#maxHp = config.maxHp;
    this.#hp = config.maxHp;
    this.#attackIds = config.attackIds;
    this.#attackParams = config.attackParams;
  }

  public get id(): string {
    return this.#id;
  }

  public get archetypeId(): string {
    return this.#archetypeId;
  }

  public get x(): number {
    return this.#x;
  }

  public get y(): number {
    return this.#y;
  }

  public get hp(): number {
    return this.#hp;
  }

  public get maxHp(): number {
    return this.#maxHp;
  }

  public get defeated(): boolean {
    return this.#defeated;
  }

  public get attackIds(): readonly string[] {
    return this.#attackIds;
  }

  public get attackParams(): Readonly<Record<string, AttackParameters>> {
    return this.#attackParams;
  }

  public applyDamage(amount: number): void {
    if (this.#defeated) return;
    this.#hp = Math.max(this.#hp - amount, 0);
    if (this.#hp <= 0) {
      this.#defeated = true;
    }
  }

  public setPosition(x: number, y: number): void {
    this.#x = x;
    this.#y = y;
  }
}
