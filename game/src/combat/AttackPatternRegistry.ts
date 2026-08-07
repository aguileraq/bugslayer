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

const REGISTRY: ReadonlyMap<string, AttackPatternStrategy> = new Map([
  ['parse.linearAttack', linearAttack],
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
