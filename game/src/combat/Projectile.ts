export interface ProjectileConfig {
  readonly x: number;
  readonly y: number;
  readonly velocityX: number;
  readonly velocityY: number;
  readonly damage: number;
  readonly key: string;
}

export interface SimulationBounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

export class Projectile {
  #x: number;
  #y: number;
  #velocityX: number;
  #velocityY: number;
  #damage: number;
  #key: string;
  #active = false;

  public constructor() {
    this.#x = 0;
    this.#y = 0;
    this.#velocityX = 0;
    this.#velocityY = 0;
    this.#damage = 0;
    this.#key = '';
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

  public get damage(): number {
    return this.#damage;
  }

  public get key(): string {
    return this.#key;
  }

  public get active(): boolean {
    return this.#active;
  }

  public activate(config: ProjectileConfig): void {
    this.#x = config.x;
    this.#y = config.y;
    this.#velocityX = config.velocityX;
    this.#velocityY = config.velocityY;
    this.#damage = config.damage;
    this.#key = config.key;
    this.#active = true;
  }

  public update(deltaMs: number): void {
    if (!this.#active) return;
    const dt = deltaMs / 1000;
    this.#x += this.#velocityX * dt;
    this.#y += this.#velocityY * dt;
  }

  public isOutOfBounds(bounds: SimulationBounds): boolean {
    return (
      this.#x < bounds.minX ||
      this.#x > bounds.maxX ||
      this.#y < bounds.minY ||
      this.#y > bounds.maxY
    );
  }

  public release(): void {
    this.#active = false;
    this.#x = 0;
    this.#y = 0;
    this.#velocityX = 0;
    this.#velocityY = 0;
    this.#damage = 0;
    this.#key = '';
  }
}
