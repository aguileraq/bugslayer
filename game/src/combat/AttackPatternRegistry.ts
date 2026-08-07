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

const REGISTRY: ReadonlyMap<string, AttackPatternStrategy> = new Map([
  ['parse.linearAttack', linearAttack],
  ['widow.reassignmentVolley', reassignmentVolley],
  ['widow.scopeWeb', scopeWeb],
  ['hornet.typeSting', typeSting],
  ['hornet.castingSwarm', castingSwarm],
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
