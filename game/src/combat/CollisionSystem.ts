import type { Projectile } from './Projectile';
import type { InvulnerabilityTracker } from './InvulnerabilityTracker';

export interface Hitbox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface CollisionResult {
  readonly hit: boolean;
  readonly damage: number;
  readonly projectile: Projectile | null;
  readonly blocked: boolean;
}

export class CollisionSystem {
  readonly #invulnerability: InvulnerabilityTracker;
  readonly #projectileRadius: number;

  public constructor(invulnerability: InvulnerabilityTracker, projectileRadius = 8) {
    this.#invulnerability = invulnerability;
    this.#projectileRadius = projectileRadius;
  }

  /**
   * Evaluates all active projectiles against the player hitbox.
   * Returns the total damage applied this frame and which projectiles hit.
   * Respects invulnerability: if active, collisions are blocked (no damage, no extend).
   */
  public evaluate(
    hitbox: Hitbox,
    projectiles: readonly Projectile[],
  ): CollisionResult[] {
    const results: CollisionResult[] = [];

    for (const projectile of projectiles) {
      if (!projectile.active) continue;

      if (!this.overlaps(hitbox, projectile)) continue;

      if (this.#invulnerability.active) {
        // Collision detected but blocked by invulnerability
        results.push({
          hit: false,
          damage: 0,
          projectile,
          blocked: true,
        });
        continue;
      }

      // Effective hit: apply damage and trigger invulnerability
      results.push({
        hit: true,
        damage: projectile.damage,
        projectile,
        blocked: false,
      });

      // Trigger invulnerability after first effective hit
      this.#invulnerability.trigger();
    }

    return results;
  }

  /**
   * Returns total damage from a set of collision results.
   */
  public static totalDamage(results: readonly CollisionResult[]): number {
    let total = 0;
    for (const r of results) {
      if (r.hit) total += r.damage;
    }
    return total;
  }

  private overlaps(hitbox: Hitbox, projectile: Projectile): boolean {
    // Treat projectile as a circle (center at x,y with radius)
    const closestX = Math.max(hitbox.x, Math.min(projectile.x, hitbox.x + hitbox.width));
    const closestY = Math.max(hitbox.y, Math.min(projectile.y, hitbox.y + hitbox.height));
    const distX = projectile.x - closestX;
    const distY = projectile.y - closestY;
    return (distX * distX + distY * distY) <= (this.#projectileRadius * this.#projectileRadius);
  }
}
