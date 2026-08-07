import { describe, expect, it } from 'vitest';

import { ProjectilePool } from '../../src/combat/ProjectilePool';
import type { ProjectileConfig } from '../../src/combat/Projectile';
import { AttackPatternRegistry, type AttackContext, type AttackParameters } from '../../src/combat/AttackPatternRegistry';

const baseConfig: ProjectileConfig = {
  x: 100,
  y: 100,
  velocityX: 160,
  velocityY: 0,
  damage: 10,
  key: 'projectile.test',
};

describe('ProjectilePool', () => {
  it('starts with zero active projectiles at full capacity', () => {
    const pool = new ProjectilePool(50);

    expect(pool.capacity).toBe(50);
    expect(pool.activeCount).toBe(0);
    expect(pool.availableCount).toBe(50);
  });

  it('acquires and tracks active projectiles', () => {
    const pool = new ProjectilePool(10);

    const p1 = pool.acquire(baseConfig);
    const p2 = pool.acquire({ ...baseConfig, x: 200 });

    expect(p1).not.toBeNull();
    expect(p2).not.toBeNull();
    expect(pool.activeCount).toBe(2);
    expect(pool.availableCount).toBe(8);
  });

  it('returns null when pool is exhausted', () => {
    const pool = new ProjectilePool(2);

    pool.acquire(baseConfig);
    pool.acquire(baseConfig);
    const p3 = pool.acquire(baseConfig);

    expect(p3).toBeNull();
    expect(pool.activeCount).toBe(2);
  });

  it('advances projectiles by deltaMs and releases out-of-bounds', () => {
    const pool = new ProjectilePool(5, { minX: -64, minY: -64, maxX: 1024, maxY: 604 });

    pool.acquire({ ...baseConfig, velocityX: 5000, velocityY: 0 }); // very fast → exits quickly
    expect(pool.activeCount).toBe(1);

    pool.update(500); // 5000 * 0.5 = 2500px → way past maxX=1024
    expect(pool.activeCount).toBe(0); // recycled
  });

  it('releases and recycles projectiles', () => {
    const pool = new ProjectilePool(3);

    const p1 = pool.acquire(baseConfig);
    pool.acquire(baseConfig);
    expect(pool.activeCount).toBe(2);

    if (p1 !== null) pool.release(p1);
    expect(pool.activeCount).toBe(1);
    expect(pool.availableCount).toBe(2);

    // Can acquire again after release
    const p3 = pool.acquire(baseConfig);
    expect(p3).not.toBeNull();
    expect(pool.activeCount).toBe(2);
  });

  it('releaseAll clears all active projectiles', () => {
    const pool = new ProjectilePool(5);

    pool.acquire(baseConfig);
    pool.acquire(baseConfig);
    pool.acquire(baseConfig);
    expect(pool.activeCount).toBe(3);

    pool.releaseAll();
    expect(pool.activeCount).toBe(0);
    expect(pool.availableCount).toBe(5);
  });

  it('update moves projectiles correctly', () => {
    const pool = new ProjectilePool(5, { minX: -1000, minY: -1000, maxX: 5000, maxY: 5000 });

    const p = pool.acquire({ ...baseConfig, velocityX: 100, velocityY: 50 });
    expect(p).not.toBeNull();

    pool.update(1000); // 1 second

    const active = pool.activeProjectiles();
    expect(active).toHaveLength(1);
    expect(active[0]?.x).toBeCloseTo(200); // 100 + 100*1
    expect(active[0]?.y).toBeCloseTo(150); // 100 + 50*1
  });
});

describe('AttackPatternRegistry', () => {
  it('registers parse.linearAttack strategy', () => {
    const registry = new AttackPatternRegistry();

    expect(registry.has('parse.linearAttack')).toBe(true);
    expect(registry.has('unknown.attack')).toBe(false);
  });

  it('generates a linear projectile toward the player', () => {
    const registry = new AttackPatternRegistry();
    const context: AttackContext = {
      enemyX: 640,
      enemyY: 270,
      playerX: 200,
      playerY: 270,
      elapsedMs: 0,
      projectilesPerBurst: 1,
    };
    const params: AttackParameters = {
      damage: 10,
      projectileSpeed: 160,
      intervalMs: 2000,
      projectilesPerBurst: 1,
    };

    const configs = registry.execute('parse.linearAttack', context, params);

    expect(configs).toHaveLength(1);
    const projectile = configs[0]!;
    expect(projectile.x).toBe(640);
    expect(projectile.y).toBe(270);
    expect(projectile.damage).toBe(10);
    // Velocity should point left (toward player at x=200)
    expect(projectile.velocityX).toBeLessThan(0);
    expect(Math.abs(projectile.velocityY)).toBeLessThan(0.01); // nearly zero (same Y)
    // Speed magnitude should be ~160
    const speed = Math.sqrt(projectile.velocityX ** 2 + projectile.velocityY ** 2);
    expect(speed).toBeCloseTo(160, 0);
  });

  it('generates multiple projectiles with spread when burst > 1', () => {
    const registry = new AttackPatternRegistry();
    const context: AttackContext = {
      enemyX: 640,
      enemyY: 270,
      playerX: 200,
      playerY: 270,
      elapsedMs: 0,
      projectilesPerBurst: 2,
    };
    const params: AttackParameters = {
      damage: 10,
      projectileSpeed: 160,
      intervalMs: 2000,
      projectilesPerBurst: 2,
    };

    const configs = registry.execute('parse.linearAttack', context, params);

    expect(configs).toHaveLength(2);
    // Both should have slightly different Y velocities (spread)
    expect(configs[0]!.velocityY).not.toEqual(configs[1]!.velocityY);
  });

  it('throws for unknown attack pattern', () => {
    const registry = new AttackPatternRegistry();
    const context: AttackContext = {
      enemyX: 0, enemyY: 0, playerX: 100, playerY: 0,
      elapsedMs: 0, projectilesPerBurst: 1,
    };
    const params: AttackParameters = {
      damage: 10, projectileSpeed: 100, intervalMs: 1000, projectilesPerBurst: 1,
    };

    expect(() => registry.execute('unknown', context, params)).toThrow('Unknown attack pattern');
  });
});
