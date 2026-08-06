import { describe, expect, it } from 'vitest';

import {
  AssetRegistry,
  AssetRegistryError,
  assetManifest,
  type LoadedAssetMetadata,
} from '../../src/assets';
import type { AssetDefinition, AssetManifest } from '../../src/types';

function metadataFor(definition: AssetDefinition): LoadedAssetMetadata {
  if (definition.type === 'spritesheet') {
    const dimensions = definition.expectedDimensions;
    if (dimensions === undefined) {
      throw new Error(`Missing test dimensions for ${definition.key}.`);
    }
    const margin = definition.frameConfig.margin ?? 0;
    const spacing = definition.frameConfig.spacing ?? 0;
    const columns = Math.floor(
      (dimensions.width - margin * 2 + spacing) /
        (definition.frameConfig.frameWidth + spacing),
    );
    const rows = Math.floor(
      (dimensions.height - margin * 2 + spacing) /
        (definition.frameConfig.frameHeight + spacing),
    );
    const capacity = columns * rows;
    const start = definition.frameConfig.startFrame ?? 0;
    const end = definition.frameConfig.endFrame ?? capacity - 1;
    return {
      key: definition.key,
      type: definition.type,
      dimensions,
      frameCount: end - start + 1,
    };
  }
  if (definition.type === 'image') {
    if (definition.expectedDimensions === undefined) {
      throw new Error(`Missing test dimensions for ${definition.key}.`);
    }
    return {
      key: definition.key,
      type: definition.type,
      dimensions: definition.expectedDimensions,
    };
  }
  return { key: definition.key, type: definition.type };
}

describe('AssetManifest', () => {
  it('maps every approved runtime asset and future tilemap to a safe stable key', () => {
    const validation = AssetRegistry.validateManifest(assetManifest);
    const required = assetManifest.assets.filter((asset) => asset.required);
    const optional = assetManifest.assets.filter((asset) => !asset.required);

    expect(validation).toEqual({ valid: true, issues: [] });
    expect(assetManifest.assets).toHaveLength(99);
    expect(required).toHaveLength(94);
    expect(optional.map((asset) => asset.key)).toEqual([
      'tilemap.initial-office',
      'tilemap.compilation-garden',
      'tilemap.mutable-widow-lair',
      'tilemap.cast-hornet-aerial-router',
      'tilemap.boolean-beetle-legacy-grove',
    ]);
    expect(
      assetManifest.assets.every((asset) => asset.url.startsWith('assets/')),
    ).toBe(true);
    expect(
      assetManifest.assets.some(
        (asset) =>
          asset.url.includes('output/') ||
          asset.url.includes('sprite-export/') ||
          asset.url.includes('://'),
      ),
    ).toBe(false);
  });

  it('covers the complete approved runtime vocabulary', () => {
    const categories = new Set(
      assetManifest.assets.map((asset) => asset.category),
    );

    expect(categories).toEqual(
      new Set([
        'font',
        'player',
        'enemy',
        'infected-enemy',
        'projectile',
        'impact',
        'tileset',
        'tilemap',
        'prop',
        'v4lk',
        'mycelial-monolith',
        'extraction',
        'ui',
        'icon',
      ]),
    );
  });
});

describe('AssetRegistry', () => {
  it('accepts the dimensions and critical frame counts of every required asset', () => {
    const registry = new AssetRegistry(assetManifest);
    const loaded = assetManifest.assets
      .filter((definition) => definition.required)
      .map(metadataFor);

    expect(registry.size).toBe(99);
    expect(registry.requiredKeys).toHaveLength(94);
    expect(registry.validateLoadedAssets(loaded)).toEqual({
      valid: true,
      issues: [],
    });
  });

  it('rejects duplicate keys, external paths, wrong extensions and invalid grids together', () => {
    const invalidManifest = {
      version: '1',
      assets: [
        {
          key: 'duplicate.asset',
          type: 'image',
          category: 'ui',
          url: 'https://example.com/master.png',
          required: true,
          expectedDimensions: { width: 64, height: 64 },
        },
        {
          key: 'duplicate.asset',
          type: 'spritesheet',
          category: 'player',
          url: 'assets/sprites/player.json',
          required: true,
          expectedDimensions: { width: 64, height: 64 },
          frameConfig: { frameWidth: 128, frameHeight: 64 },
        },
      ],
    } satisfies AssetManifest;

    const validation = AssetRegistry.validateManifest(invalidManifest);

    expect(validation.valid).toBe(false);
    expect(validation.issues.map((entry) => entry.code)).toEqual([
      'INVALID_RUNTIME_URL',
      'INVALID_DEFINITION',
      'DUPLICATE_KEY',
      'INVALID_DEFINITION',
    ]);
    expect(() => new AssetRegistry(invalidManifest)).toThrowError(
      AssetRegistryError,
    );
  });

  it('aggregates missing, unknown, duplicated and incompatible load results', () => {
    const manifest = {
      version: '1',
      assets: [
        {
          key: 'player.idle',
          type: 'spritesheet',
          category: 'player',
          url: 'assets/player-idle.png',
          required: true,
          expectedDimensions: { width: 384, height: 512 },
          frameConfig: { frameWidth: 128, frameHeight: 128 },
        },
        {
          key: 'ui.logo',
          type: 'image',
          category: 'ui',
          url: 'assets/logo.png',
          required: true,
          expectedDimensions: { width: 64, height: 64 },
        },
      ],
    } satisfies AssetManifest;
    const registry = new AssetRegistry(manifest);
    const loaded = [
      {
        key: 'player.idle',
        type: 'image',
        dimensions: { width: 128, height: 128 },
        frameCount: 1,
      },
      {
        key: 'player.idle',
        type: 'image',
        dimensions: { width: 128, height: 128 },
        frameCount: 1,
      },
      { key: 'unknown.asset', type: 'image' },
    ] satisfies readonly LoadedAssetMetadata[];

    const validation = registry.validateLoadedAssets(loaded);

    expect(validation.valid).toBe(false);
    expect(validation.issues.map((entry) => entry.code)).toEqual([
      'DUPLICATE_LOAD_RESULT',
      'DIMENSION_MISMATCH',
      'DIMENSION_MISMATCH',
      'FRAME_COUNT_MISMATCH',
      'FRAME_COUNT_MISMATCH',
      'TYPE_MISMATCH',
      'TYPE_MISMATCH',
      'MISSING_REQUIRED_ASSET',
      'UNKNOWN_KEY',
    ]);
    expect(() => registry.validateLoadedAssetsOrThrow(loaded)).toThrowError(
      AssetRegistryError,
    );
  });

  it('resolves definitions and rejects unknown required lookups', () => {
    const registry = new AssetRegistry(assetManifest);

    expect(registry.has('player.idle')).toBe(true);
    expect(registry.get('player.idle')?.type).toBe('spritesheet');
    expect(() => registry.require('missing.asset')).toThrowError(
      AssetRegistryError,
    );
  });
});
