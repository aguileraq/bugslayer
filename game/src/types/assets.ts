import type { Dimensions } from './primitives';

export type AssetKey = string;

export const ASSET_CATEGORIES = [
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
] as const;

export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

interface BaseAssetDefinition<T extends string> {
  readonly key: AssetKey;
  readonly type: T;
  readonly category: AssetCategory;
  readonly url: string;
  readonly required: boolean;
}

export interface FontAssetDefinition extends BaseAssetDefinition<'font'> {
  readonly family: string;
}

export interface ImageAssetDefinition extends BaseAssetDefinition<'image'> {
  readonly expectedDimensions?: Dimensions;
}

export interface SpriteSheetFrameConfig {
  readonly frameWidth: number;
  readonly frameHeight: number;
  readonly startFrame?: number;
  readonly endFrame?: number;
  readonly margin?: number;
  readonly spacing?: number;
}

export interface SpriteSheetAssetDefinition
  extends BaseAssetDefinition<'spritesheet'> {
  readonly frameConfig: SpriteSheetFrameConfig;
  readonly expectedDimensions?: Dimensions;
}

export interface TilemapAssetDefinition extends BaseAssetDefinition<'tilemap'> {
  readonly format: 'tiled-json';
}

export interface JsonAssetDefinition extends BaseAssetDefinition<'json'> {}

export type AssetDefinition =
  | FontAssetDefinition
  | ImageAssetDefinition
  | SpriteSheetAssetDefinition
  | TilemapAssetDefinition
  | JsonAssetDefinition;

export interface AssetManifest {
  readonly version: string;
  readonly assets: readonly AssetDefinition[];
}
