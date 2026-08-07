import type { ProjectileConfig } from './Projectile';

export interface AttackContext {
  readonly enemyX: number;
  readonly enemyY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly elapsedMs: number;
  readonly projectilesPerBurst: number;
}

export interface AttackParameters {
  readonly damage: number;
  readonly projectileSpeed: number;
  readonly intervalMs: number;
  readonly projectilesPerBurst: number;
  readonly [key: string]: unknown;
}

export type AttackPatternStrategy = (
  context: AttackContext,
  params: AttackParameters,
) => readonly ProjectileConfig[];

function linearAttack(
  context: AttackContext,
  params: AttackParameters,
): readonly ProjectileConfig[] {
  const dx = context.playerX - context.enemyX;
  const dy = context.playerY - context.enemyY;
  const magnitude = Math.sqrt(dx * dx + dy * dy);

  if (magnitude === 0) return [];

  const dirX = dx / magnitude;
  const dirY = dy / magnitude;

  const configs: ProjectileConfig[] = [];
  for (let i = 0; i < context.projectilesPerBurst; i++) {
    // Slight spread for multiple projectiles
    const spread = context.projectilesPerBurst > 1
      ? (i - (context.projectilesPerBurst - 1) / 2) * 0.15
      : 0;
    const spreadX = dirX * Math.cos(spread) - dirY * Math.sin(spread);
    const spreadY = dirX * Math.sin(spread) + dirY * Math.cos(spread);

    configs.push({
      x: context.enemyX,
      y: context.enemyY,
      velocityX: spreadX * params.projectileSpeed,
      velocityY: spreadY * params.projectileSpeed,
      damage: params.damage,
      key: 'projectile.parse-mantis.linear',
    });
  }

  return configs;
}

function reassignmentVolley(
  context: AttackContext,
  params: AttackParameters,
): readonly ProjectileConfig[] {
  const dx = context.playerX - context.enemyX;
  const dy = context.playerY - context.enemyY;
  const magnitude = Math.sqrt(dx * dx + dy * dy);

  if (magnitude === 0) return [];

  const dirX = dx / magnitude;
  const dirY = dy / magnitude;

  const configs: ProjectileConfig[] = [];
  for (let i = 0; i < context.projectilesPerBurst; i++) {
    const spread = context.projectilesPerBurst > 1
      ? (i - (context.projectilesPerBurst - 1) / 2) * 0.25
      : 0;
    const spreadX = dirX * Math.cos(spread) - dirY * Math.sin(spread);
    const spreadY = dirX * Math.sin(spread) + dirY * Math.cos(spread);

    configs.push({
      x: context.enemyX,
      y: context.enemyY,
      velocityX: spreadX * params.projectileSpeed,
      velocityY: spreadY * params.projectileSpeed,
      damage: params.damage,
      key: 'projectile.mutable-widow.reassignment-volley',
    });
  }

  return configs;
}

function scopeWeb(
  context: AttackContext,
  params: AttackParameters,
): readonly ProjectileConfig[] {
  // Slow-moving area projectile toward player
  const dx = context.playerX - context.enemyX;
  const dy = context.playerY - context.enemyY;
  const magnitude = Math.sqrt(dx * dx + dy * dy);

  if (magnitude === 0) return [];

  const dirX = dx / magnitude;
  const dirY = dy / magnitude;

  return [{
    x: context.enemyX,
    y: context.enemyY,
    velocityX: dirX * params.projectileSpeed,
    velocityY: dirY * params.projectileSpeed,
    damage: params.damage,
    key: 'projectile.mutable-widow.scope-web',
  }];
}

function typeSting(
  context: AttackContext,
  params: AttackParameters,
): readonly ProjectileConfig[] {
  // Fast single projectile toward player
  const dx = context.playerX - context.enemyX;
  const dy = context.playerY - context.enemyY;
  const magnitude = Math.sqrt(dx * dx + dy * dy);

  if (magnitude === 0) return [];

  const dirX = dx / magnitude;
  const dirY = dy / magnitude;

  return [{
    x: context.enemyX,
    y: context.enemyY,
    velocityX: dirX * params.projectileSpeed,
    velocityY: dirY * params.projectileSpeed,
    damage: params.damage,
    key: 'projectile.cast-hornet.casting-swarm',
  }];
}

function castingSwarm(
  context: AttackContext,
  params: AttackParameters,
): readonly ProjectileConfig[] {
  // Fan of projectiles toward player
  const dx = context.playerX - context.enemyX;
  const dy = context.playerY - context.enemyY;
  const magnitude = Math.sqrt(dx * dx + dy * dy);

  if (magnitude === 0) return [];

  const dirX = dx / magnitude;
  const dirY = dy / magnitude;

  const configs: ProjectileConfig[] = [];
  for (let i = 0; i < context.projectilesPerBurst; i++) {
    const spread = (i - (context.projectilesPerBurst - 1) / 2) * 0.3;
    const spreadX = dirX * Math.cos(spread) - dirY * Math.sin(spread);
    const spreadY = dirX * Math.sin(spread) + dirY * Math.cos(spread);

    configs.push({
      x: context.enemyX,
      y: context.enemyY,
      velocityX: spreadX * params.projectileSpeed,
      velocityY: spreadY * params.projectileSpeed,
      damage: params.damage,
      key: 'projectile.cast-hornet.casting-swarm',
    });
  }

  return configs;
}

function booleanBurst(
  context: AttackContext,
  params: AttackParameters,
): readonly ProjectileConfig[] {
  // Radial fan of projectiles spreading outward from enemy
  const dx = context.playerX - context.enemyX;
  const dy = context.playerY - context.enemyY;
  const magnitude = Math.sqrt(dx * dx + dy * dy);

  if (magnitude === 0) return [];

  const baseAngle = Math.atan2(dy, dx);
  const configs: ProjectileConfig[] = [];
  const count = context.projectilesPerBurst;
  const totalSpread = 0.8; // ~45° total arc

  for (let i = 0; i < count; i++) {
    const offset = count > 1
      ? (i - (count - 1) / 2) * (totalSpread / (count - 1))
      : 0;
    const angle = baseAngle + offset;

    configs.push({
      x: context.enemyX,
      y: context.enemyY,
      velocityX: Math.cos(angle) * params.projectileSpeed,
      velocityY: Math.sin(angle) * params.projectileSpeed,
      damage: params.damage,
      key: 'projectile.boolean-beetle.boolean-burst',
    });
  }

  return configs;
}

function xorCrossfire(
  context: AttackContext,
  params: AttackParameters,
): readonly ProjectileConfig[] {
  // X-pattern: 4 projectiles in diagonal directions from enemy toward player's quadrant
  const dx = context.playerX - context.enemyX;
  const dy = context.playerY - context.enemyY;
  const magnitude = Math.sqrt(dx * dx + dy * dy);

  if (magnitude === 0) return [];

  const baseAngle = Math.atan2(dy, dx);
  const configs: ProjectileConfig[] = [];

  // 4 projectiles at ±30° and ±60° from base direction
  const offsets = [-0.5, -0.17, 0.17, 0.5];
  for (const offset of offsets) {
    const angle = baseAngle + offset;
    configs.push({
      x: context.enemyX,
      y: context.enemyY,
      velocityX: Math.cos(angle) * params.projectileSpeed,
      velocityY: Math.sin(angle) * params.projectileSpeed,
      damage: params.damage,
      key: 'projectile.boolean-beetle.xor-crossfire',
    });
  }

  return configs;
}

function falsePath(
  context: AttackContext,
  params: AttackParameters,
): readonly ProjectileConfig[] {
  // One real damaging projectile + visual decoys (decoys have 0 damage)
  const dx = context.playerX - context.enemyX;
  const dy = context.playerY - context.enemyY;
  const magnitude = Math.sqrt(dx * dx + dy * dy);

  if (magnitude === 0) return [];

  const baseAngle = Math.atan2(dy, dx);
  const configs: ProjectileConfig[] = [];

  // Real projectile (center)
  configs.push({
    x: context.enemyX,
    y: context.enemyY,
    velocityX: Math.cos(baseAngle) * params.projectileSpeed,
    velocityY: Math.sin(baseAngle) * params.projectileSpeed,
    damage: params.damage,
    key: 'projectile.boolean-beetle.false-path',
  });

  // Decoy projectiles (0 damage, slightly offset angles)
  const decoyOffsets = [-0.35, 0.35];
  for (const offset of decoyOffsets) {
    const angle = baseAngle + offset;
    configs.push({
      x: context.enemyX,
      y: context.enemyY,
      velocityX: Math.cos(angle) * params.projectileSpeed,
      velocityY: Math.sin(angle) * params.projectileSpeed,
      damage: 0,
      key: 'projectile.boolean-beetle.false-path',
    });
  }

  return configs;
}

function branchCharge(
  _context: AttackContext,
  _params: AttackParameters,
): readonly ProjectileConfig[] {
  // Branch Charge is a body attack — not projectile-based.
  // Returns empty: the charge is handled by the Enemy movement system
  // and evaluated directly by CollisionSystem as a body collision.
  // This entry exists so AttackPatternRegistry.has('beetle.branchCharge') returns true.
  return [];
}

const REGISTRY: ReadonlyMap<string, AttackPatternStrategy> = new Map([
  ['parse.linearAttack', linearAttack],
  ['widow.reassignmentVolley', reassignmentVolley],
  ['widow.scopeWeb', scopeWeb],
  ['hornet.typeSting', typeSting],
  ['hornet.castingSwarm', castingSwarm],
  ['beetle.booleanBurst', booleanBurst],
  ['beetle.xorCrossfire', xorCrossfire],
  ['beetle.falsePath', falsePath],
  ['beetle.branchCharge', branchCharge],
]);

export class AttackPatternRegistry {
  public has(id: string): boolean {
    return REGISTRY.has(id);
  }

  public execute(
    id: string,
    context: AttackContext,
    params: AttackParameters,
  ): readonly ProjectileConfig[] {
    const strategy = REGISTRY.get(id);
    if (strategy === undefined) {
      throw new Error(`Unknown attack pattern: "${id}".`);
    }
    return strategy(context, params);
  }
}
