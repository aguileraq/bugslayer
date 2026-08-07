import type { GameState } from '../types';

export interface PlayerConfig {
  readonly speed: number;
  readonly startX: number;
  readonly startY: number;
  readonly hitboxWidth: number;
  readonly hitboxHeight: number;
  readonly hitboxOffsetX: number;
  readonly hitboxOffsetY: number;
}

export interface CollisionRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface PlayerSnapshot {
  readonly x: number;
  readonly y: number;
  readonly velocityX: number;
  readonly velocityY: number;
  readonly direction: PlayerDirection;
  readonly moving: boolean;
}

export type PlayerDirection = 'up' | 'down' | 'left' | 'right';

const MOVEMENT_STATES: ReadonlySet<GameState> = new Set([
  'Exploration',
  'Playing',
  'Challenge',
]);

const DEFAULT_CONFIG: PlayerConfig = {
  speed: 120,
  startX: 224,
  startY: 256,
  hitboxWidth: 24,
  hitboxHeight: 28,
  hitboxOffsetX: 4,
  hitboxOffsetY: 4,
};

export class Player {
  readonly #config: PlayerConfig;
  #x: number;
  #y: number;
  #velocityX = 0;
  #velocityY = 0;
  #direction: PlayerDirection = 'down';
  #moving = false;

  public constructor(config: Partial<PlayerConfig> = {}) {
    this.#config = { ...DEFAULT_CONFIG, ...config };
    this.#x = this.#config.startX;
    this.#y = this.#config.startY;
  }

  public get x(): number {
    return this.#x;
  }

  public get y(): number {
    return this.#y;
  }

  public get velocityX(): number {
    return this.#velocityX;
  }

  public get velocityY(): number {
    return this.#velocityY;
  }

  public get direction(): PlayerDirection {
    return this.#direction;
  }

  public get moving(): boolean {
    return this.#moving;
  }

  public get speed(): number {
    return this.#config.speed;
  }

  public get hitbox(): CollisionRect {
    return {
      x: this.#x + this.#config.hitboxOffsetX,
      y: this.#y + this.#config.hitboxOffsetY,
      width: this.#config.hitboxWidth,
      height: this.#config.hitboxHeight,
    };
  }

  public snapshot(): PlayerSnapshot {
    return {
      x: this.#x,
      y: this.#y,
      velocityX: this.#velocityX,
      velocityY: this.#velocityY,
      direction: this.#direction,
      moving: this.#moving,
    };
  }

  public setPosition(x: number, y: number): void {
    this.#x = x;
    this.#y = y;
  }

  public applyIntent(
    intentX: number,
    intentY: number,
    state: GameState,
  ): void {
    if (!MOVEMENT_STATES.has(state)) {
      this.#velocityX = 0;
      this.#velocityY = 0;
      this.#moving = false;
      return;
    }

    if (intentX === 0 && intentY === 0) {
      this.#velocityX = 0;
      this.#velocityY = 0;
      this.#moving = false;
      return;
    }

    // Normalize diagonal movement
    const magnitude = Math.sqrt(intentX * intentX + intentY * intentY);
    this.#velocityX = (intentX / magnitude) * this.#config.speed;
    this.#velocityY = (intentY / magnitude) * this.#config.speed;
    this.#moving = true;

    // Determine dominant direction for animation
    if (Math.abs(intentX) >= Math.abs(intentY)) {
      this.#direction = intentX > 0 ? 'right' : 'left';
    } else {
      this.#direction = intentY > 0 ? 'down' : 'up';
    }
  }

  public update(deltaMs: number, collisions: readonly CollisionRect[]): void {
    if (!this.#moving) return;

    const deltaSeconds = deltaMs / 1000;
    const newX = this.#x + this.#velocityX * deltaSeconds;
    const newY = this.#y + this.#velocityY * deltaSeconds;

    // Try full movement first
    const candidateHitbox: CollisionRect = {
      x: newX + this.#config.hitboxOffsetX,
      y: newY + this.#config.hitboxOffsetY,
      width: this.#config.hitboxWidth,
      height: this.#config.hitboxHeight,
    };

    if (!this.collidesWithAny(candidateHitbox, collisions)) {
      this.#x = newX;
      this.#y = newY;
      return;
    }

    // Try axis separation: move X only
    const xOnlyHitbox: CollisionRect = {
      x: newX + this.#config.hitboxOffsetX,
      y: this.#y + this.#config.hitboxOffsetY,
      width: this.#config.hitboxWidth,
      height: this.#config.hitboxHeight,
    };

    if (!this.collidesWithAny(xOnlyHitbox, collisions)) {
      this.#x = newX;
    }

    // Try axis separation: move Y only
    const yOnlyHitbox: CollisionRect = {
      x: this.#x + this.#config.hitboxOffsetX,
      y: newY + this.#config.hitboxOffsetY,
      width: this.#config.hitboxWidth,
      height: this.#config.hitboxHeight,
    };

    if (!this.collidesWithAny(yOnlyHitbox, collisions)) {
      this.#y = newY;
    }
  }

  public reset(): void {
    this.#x = this.#config.startX;
    this.#y = this.#config.startY;
    this.#velocityX = 0;
    this.#velocityY = 0;
    this.#direction = 'down';
    this.#moving = false;
  }

  private collidesWithAny(
    hitbox: CollisionRect,
    collisions: readonly CollisionRect[],
  ): boolean {
    for (const rect of collisions) {
      if (this.rectsOverlap(hitbox, rect)) return true;
    }
    return false;
  }

  private rectsOverlap(a: CollisionRect, b: CollisionRect): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
}
