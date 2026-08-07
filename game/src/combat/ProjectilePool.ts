import { Projectile, type ProjectileConfig, type SimulationBounds } from './Projectile';

const DEFAULT_CAPACITY = 200;

const DEFAULT_BOUNDS: SimulationBounds = {
  minX: -64,
  minY: -64,
  maxX: 1024,
  maxY: 604,
};

export class ProjectilePool {
  readonly #pool: Projectile[];
  readonly #bounds: SimulationBounds;
  readonly #capacity: number;

  public constructor(capacity = DEFAULT_CAPACITY, bounds: SimulationBounds = DEFAULT_BOUNDS) {
    this.#capacity = capacity;
    this.#bounds = bounds;
    this.#pool = [];
    for (let i = 0; i < capacity; i++) {
      this.#pool.push(new Projectile());
    }
  }

  public get capacity(): number {
    return this.#capacity;
  }

  public get activeCount(): number {
    let count = 0;
    for (const p of this.#pool) {
      if (p.active) count++;
    }
    return count;
  }

  public get availableCount(): number {
    return this.#capacity - this.activeCount;
  }

  public acquire(config: ProjectileConfig): Projectile | null {
    for (const p of this.#pool) {
      if (!p.active) {
        p.activate(config);
        return p;
      }
    }
    // Pool exhausted
    return null;
  }

  public update(deltaMs: number): void {
    for (const p of this.#pool) {
      if (!p.active) continue;
      p.update(deltaMs);
      if (p.isOutOfBounds(this.#bounds)) {
        p.release();
      }
    }
  }

  public activeProjectiles(): readonly Projectile[] {
    return this.#pool.filter((p) => p.active);
  }

  public releaseAll(): void {
    for (const p of this.#pool) {
      if (p.active) p.release();
    }
  }

  public release(projectile: Projectile): void {
    projectile.release();
  }
}
