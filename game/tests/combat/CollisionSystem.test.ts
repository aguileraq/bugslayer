import { describe, expect, it } from 'vitest';

import { CollisionSystem, type Hitbox } from '../../src/combat/CollisionSystem';
import { InvulnerabilityTracker } from '../../src/combat/InvulnerabilityTracker';
import { Projectile, type ProjectileConfig } from '../../src/combat/Projectile';

function createProjectile(overrides: Partial<ProjectileConfig> = {}): Projectile {
  const config: ProjectileConfig = {
    x: 100,
    y: 100,
    velocityX: 0,
    velocityY: 0,
    damage: 10,
    key: 'test',
    ...overrides,
  };
  const p = new Projectile();
  p.activate(config);
  return p;
}

const playerHitbox: Hitbox = { x: 90, y: 90, width: 24, height: 28 };

describe('InvulnerabilityTracker', () => {
  it('starts inactive', () => {
    const tracker = new InvulnerabilityTracker();

    expect(tracker.active).toBe(false);
    expect(tracker.remainingMs).toBe(0);
  });

  it('triggers a 500ms window', () => {
    const tracker = new InvulnerabilityTracker(500);

    tracker.trigger();
    expect(tracker.active).toBe(true);
    expect(tracker.remainingMs).toBe(500);
  });

  it('does NOT restart or extend an active window', () => {
    const tracker = new InvulnerabilityTracker(500);

    tracker.trigger();
    tracker.update(200); // 300ms remaining
    tracker.trigger(); // should be ignored

    expect(tracker.remainingMs).toBe(300);
  });

  it('expires after the full duration', () => {
    const tracker = new InvulnerabilityTracker(500);

    tracker.trigger();
    tracker.update(250);
    expect(tracker.active).toBe(true);
    expect(tracker.remainingMs).toBe(250);

    tracker.update(250);
    expect(tracker.active).toBe(false);
    expect(tracker.remainingMs).toBe(0);
  });

  it('does not go below zero', () => {
    const tracker = new InvulnerabilityTracker(500);

    tracker.trigger();
    tracker.update(1000); // overshoot

    expect(tracker.remainingMs).toBe(0);
    expect(tracker.active).toBe(false);
  });

  it('can trigger again after expiring', () => {
    const tracker = new InvulnerabilityTracker(500);

    tracker.trigger();
    tracker.update(500); // expired
    expect(tracker.active).toBe(false);

    tracker.trigger(); // new window
    expect(tracker.active).toBe(true);
    expect(tracker.remainingMs).toBe(500);
  });

  it('reset clears the window immediately', () => {
    const tracker = new InvulnerabilityTracker(500);

    tracker.trigger();
    tracker.reset();

    expect(tracker.active).toBe(false);
    expect(tracker.remainingMs).toBe(0);
  });
});

describe('CollisionSystem', () => {
  it('detects an effective hit when projectile overlaps hitbox', () => {
    const tracker = new InvulnerabilityTracker(500);
    const system = new CollisionSystem(tracker);
    const projectile = createProjectile({ x: 100, y: 100, damage: 15 });

    const results = system.evaluate(playerHitbox, [projectile]);

    expect(results).toHaveLength(1);
    expect(results[0]!.hit).toBe(true);
    expect(results[0]!.damage).toBe(15);
    expect(results[0]!.blocked).toBe(false);
    expect(results[0]!.projectile).toBe(projectile);
  });

  it('triggers invulnerability after first effective hit', () => {
    const tracker = new InvulnerabilityTracker(500);
    const system = new CollisionSystem(tracker);
    const projectile = createProjectile({ x: 100, y: 100 });

    system.evaluate(playerHitbox, [projectile]);

    expect(tracker.active).toBe(true);
    expect(tracker.remainingMs).toBe(500);
  });

  it('blocks damage during invulnerability window', () => {
    const tracker = new InvulnerabilityTracker(500);
    const system = new CollisionSystem(tracker);

    // First hit triggers invulnerability
    const p1 = createProjectile({ x: 100, y: 100, damage: 10 });
    const results1 = system.evaluate(playerHitbox, [p1]);
    expect(results1[0]!.hit).toBe(true);

    // Second hit is blocked
    const p2 = createProjectile({ x: 95, y: 95, damage: 10 });
    const results2 = system.evaluate(playerHitbox, [p2]);
    expect(results2[0]!.hit).toBe(false);
    expect(results2[0]!.blocked).toBe(true);
    expect(results2[0]!.damage).toBe(0);
  });

  it('allows damage again after invulnerability expires', () => {
    const tracker = new InvulnerabilityTracker(500);
    const system = new CollisionSystem(tracker);

    // First hit
    const p1 = createProjectile({ x: 100, y: 100, damage: 10 });
    system.evaluate(playerHitbox, [p1]);

    // Expire invulnerability
    tracker.update(500);
    expect(tracker.active).toBe(false);

    // New hit goes through
    const p2 = createProjectile({ x: 100, y: 100, damage: 20 });
    const results = system.evaluate(playerHitbox, [p2]);
    expect(results[0]!.hit).toBe(true);
    expect(results[0]!.damage).toBe(20);
  });

  it('does not detect collision when projectile is far from hitbox', () => {
    const tracker = new InvulnerabilityTracker(500);
    const system = new CollisionSystem(tracker);
    const projectile = createProjectile({ x: 500, y: 500, damage: 10 });

    const results = system.evaluate(playerHitbox, [projectile]);

    expect(results).toHaveLength(0);
  });

  it('only counts first hit in a frame (invulnerability triggers immediately)', () => {
    const tracker = new InvulnerabilityTracker(500);
    const system = new CollisionSystem(tracker);
    const p1 = createProjectile({ x: 100, y: 100, damage: 10 });
    const p2 = createProjectile({ x: 95, y: 95, damage: 20 });

    const results = system.evaluate(playerHitbox, [p1, p2]);

    // First hit is effective, second is blocked by the invuln triggered by first
    const hits = results.filter((r) => r.hit);
    const blocked = results.filter((r) => r.blocked);
    expect(hits).toHaveLength(1);
    expect(hits[0]!.damage).toBe(10);
    expect(blocked).toHaveLength(1);
  });

  it('totalDamage sums only effective hits', () => {
    const results = [
      { hit: true, damage: 10, projectile: null, blocked: false },
      { hit: false, damage: 0, projectile: null, blocked: true },
      { hit: true, damage: 20, projectile: null, blocked: false },
    ];

    expect(CollisionSystem.totalDamage(results)).toBe(30);
  });

  it('skips inactive projectiles', () => {
    const tracker = new InvulnerabilityTracker(500);
    const system = new CollisionSystem(tracker);
    const p = new Projectile(); // not activated → inactive

    const results = system.evaluate(playerHitbox, [p]);
    expect(results).toHaveLength(0);
  });
});
