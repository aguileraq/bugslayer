import type {
  AssetDefinition,
  AssetManifest,
  AssetKey,
  Dimensions,
  SpriteSheetAssetDefinition,
} from '../types';

export const ASSET_REGISTRY_ISSUE_CODES = [
  'DUPLICATE_KEY',
  'DUPLICATE_LOAD_RESULT',
  'INVALID_DEFINITION',
  'INVALID_RUNTIME_URL',
  'MISSING_REQUIRED_ASSET',
  'UNKNOWN_KEY',
  'TYPE_MISMATCH',
  'DIMENSION_MISMATCH',
  'FRAME_COUNT_MISMATCH',
] as const;

export type AssetRegistryIssueCode =
  (typeof ASSET_REGISTRY_ISSUE_CODES)[number];

export interface AssetRegistryIssue {
  readonly code: AssetRegistryIssueCode;
  readonly key: AssetKey;
  readonly path: string;
  readonly message: string;
}

export interface AssetRegistryReport {
  readonly valid: boolean;
  readonly issues: readonly AssetRegistryIssue[];
}

export interface LoadedAssetMetadata {
  readonly key: AssetKey;
  readonly type: AssetDefinition['type'];
  readonly dimensions?: Dimensions;
  readonly frameCount?: number;
}

type BootAssetErrorCode = 'BOOT_ASSET_LOAD_FAILED' | 'BOOT_MANIFEST_INVALID';

const KEY_PATTERN = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif']);
const FONT_EXTENSIONS = new Set(['woff', 'woff2', 'ttf', 'otf']);

function compareIssues(left: AssetRegistryIssue, right: AssetRegistryIssue): number {
  return (
    left.path.localeCompare(right.path) ||
    left.code.localeCompare(right.code) ||
    left.message.localeCompare(right.message)
  );
}

function report(issues: readonly AssetRegistryIssue[]): AssetRegistryReport {
  const sorted = [...issues].sort(compareIssues);
  return { valid: sorted.length === 0, issues: sorted };
}

function issue(
  code: AssetRegistryIssueCode,
  key: AssetKey,
  path: string,
  message: string,
): AssetRegistryIssue {
  return { code, key, path, message };
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

function extensionOf(url: string): string {
  const filename = url.slice(url.lastIndexOf('/') + 1);
  const separator = filename.lastIndexOf('.');
  return separator === -1 ? '' : filename.slice(separator + 1).toLowerCase();
}

function hasSafeRuntimeUrl(url: string): boolean {
  return (
    url.startsWith('assets/') &&
    !url.startsWith('/') &&
    !url.includes('\\') &&
    !url.includes('..') &&
    !url.includes('://') &&
    !url.includes('?') &&
    !url.includes('#')
  );
}

function hasExpectedExtension(definition: AssetDefinition): boolean {
  const extension = extensionOf(definition.url);
  switch (definition.type) {
    case 'font':
      return FONT_EXTENSIONS.has(extension);
    case 'image':
    case 'spritesheet':
      return IMAGE_EXTENSIONS.has(extension);
    case 'tilemap':
    case 'json':
      return extension === 'json';
  }
}

function frameCapacity(
  definition: SpriteSheetAssetDefinition,
  dimensions: Dimensions,
): number | null {
  const { frameWidth, frameHeight } = definition.frameConfig;
  const margin = definition.frameConfig.margin ?? 0;
  const spacing = definition.frameConfig.spacing ?? 0;
  const usableWidth = dimensions.width - margin * 2;
  const usableHeight = dimensions.height - margin * 2;
  if (usableWidth < frameWidth || usableHeight < frameHeight) return null;
  const columns = Math.floor((usableWidth + spacing) / (frameWidth + spacing));
  const rows = Math.floor((usableHeight + spacing) / (frameHeight + spacing));
  return columns * rows;
}

function validateDimensions(
  definition: AssetDefinition,
  path: string,
): readonly AssetRegistryIssue[] {
  if (definition.type !== 'image' && definition.type !== 'spritesheet') return [];
  const dimensions = definition.expectedDimensions;
  if (dimensions === undefined) return [];
  const issues: AssetRegistryIssue[] = [];
  if (!isPositiveInteger(dimensions.width) || !isPositiveInteger(dimensions.height)) {
    issues.push(
      issue(
        'INVALID_DEFINITION',
        definition.key,
        `${path}.expectedDimensions`,
        'Expected dimensions must be positive integers.',
      ),
    );
  }
  return issues;
}

function validateFrameConfiguration(
  definition: SpriteSheetAssetDefinition,
  path: string,
): readonly AssetRegistryIssue[] {
  const issues: AssetRegistryIssue[] = [];
  const { frameWidth, frameHeight, startFrame, endFrame, margin, spacing } =
    definition.frameConfig;
  if (!isPositiveInteger(frameWidth) || !isPositiveInteger(frameHeight)) {
    issues.push(
      issue(
        'INVALID_DEFINITION',
        definition.key,
        `${path}.frameConfig`,
        'Frame dimensions must be positive integers.',
      ),
    );
  }
  if (margin !== undefined && !isNonNegativeInteger(margin)) {
    issues.push(
      issue(
        'INVALID_DEFINITION',
        definition.key,
        `${path}.frameConfig.margin`,
        'Frame margin must be a non-negative integer.',
      ),
    );
  }
  if (spacing !== undefined && !isNonNegativeInteger(spacing)) {
    issues.push(
      issue(
        'INVALID_DEFINITION',
        definition.key,
        `${path}.frameConfig.spacing`,
        'Frame spacing must be a non-negative integer.',
      ),
    );
  }
  if (startFrame !== undefined && !isNonNegativeInteger(startFrame)) {
    issues.push(
      issue(
        'INVALID_DEFINITION',
        definition.key,
        `${path}.frameConfig.startFrame`,
        'Start frame must be a non-negative integer.',
      ),
    );
  }
  if (endFrame !== undefined && !isNonNegativeInteger(endFrame)) {
    issues.push(
      issue(
        'INVALID_DEFINITION',
        definition.key,
        `${path}.frameConfig.endFrame`,
        'End frame must be a non-negative integer.',
      ),
    );
  }
  if (
    startFrame !== undefined &&
    endFrame !== undefined &&
    startFrame > endFrame
  ) {
    issues.push(
      issue(
        'INVALID_DEFINITION',
        definition.key,
        `${path}.frameConfig`,
        'Start frame cannot be greater than end frame.',
      ),
    );
  }
  const dimensions = definition.expectedDimensions;
  if (dimensions !== undefined && issues.length === 0) {
    const capacity = frameCapacity(definition, dimensions);
    const first = startFrame ?? 0;
    const last = endFrame ?? (capacity === null ? -1 : capacity - 1);
    if (capacity === null || last >= capacity || first >= capacity) {
      issues.push(
        issue(
          'INVALID_DEFINITION',
          definition.key,
          `${path}.frameConfig`,
          'Frame configuration does not fit the expected sheet dimensions.',
        ),
      );
    }
  }
  return issues;
}

export class AssetRegistryError extends Error {
  public readonly code: BootAssetErrorCode;
  public readonly issues: readonly AssetRegistryIssue[];

  public constructor(
    code: BootAssetErrorCode,
    issues: readonly AssetRegistryIssue[],
  ) {
    super(`${code}: ${issues.length} asset validation issue(s).`);
    this.name = 'AssetRegistryError';
    this.code = code;
    this.issues = issues;
  }
}

export class AssetRegistry {
  readonly #definitions: ReadonlyMap<AssetKey, AssetDefinition>;

  public constructor(manifest: AssetManifest) {
    const validation = AssetRegistry.validateManifest(manifest);
    if (!validation.valid) {
      throw new AssetRegistryError('BOOT_MANIFEST_INVALID', validation.issues);
    }
    this.#definitions = new Map(
      manifest.assets.map((definition) => [definition.key, definition]),
    );
  }

  public static validateManifest(manifest: AssetManifest): AssetRegistryReport {
    const issues: AssetRegistryIssue[] = [];
    const keys = new Set<AssetKey>();
    if (manifest.version.trim().length === 0) {
      issues.push(
        issue(
          'INVALID_DEFINITION',
          '$manifest',
          'manifest.version',
          'Manifest version must not be empty.',
        ),
      );
    }
    manifest.assets.forEach((definition, index) => {
      const path = `manifest.assets[${index}]`;
      if (keys.has(definition.key)) {
        issues.push(
          issue(
            'DUPLICATE_KEY',
            definition.key,
            `${path}.key`,
            `Duplicate asset key "${definition.key}".`,
          ),
        );
      }
      keys.add(definition.key);
      if (!KEY_PATTERN.test(definition.key)) {
        issues.push(
          issue(
            'INVALID_DEFINITION',
            definition.key,
            `${path}.key`,
            'Asset key must use lowercase dot- or dash-separated segments.',
          ),
        );
      }
      if (!hasSafeRuntimeUrl(definition.url)) {
        issues.push(
          issue(
            'INVALID_RUNTIME_URL',
            definition.key,
            `${path}.url`,
            'Asset URL must stay under the relative assets/ runtime root.',
          ),
        );
      }
      if (!hasExpectedExtension(definition)) {
        issues.push(
          issue(
            'INVALID_DEFINITION',
            definition.key,
            `${path}.type`,
            `Asset type "${definition.type}" does not match its file extension.`,
          ),
        );
      }
      if (definition.type === 'font' && definition.category !== 'font') {
        issues.push(
          issue(
            'INVALID_DEFINITION',
            definition.key,
            `${path}.category`,
            'Font assets must use the font category.',
          ),
        );
      }
      if (definition.type === 'tilemap' && definition.category !== 'tilemap') {
        issues.push(
          issue(
            'INVALID_DEFINITION',
            definition.key,
            `${path}.category`,
            'Tilemap assets must use the tilemap category.',
          ),
        );
      }
      issues.push(...validateDimensions(definition, path));
      if (definition.type === 'spritesheet') {
        issues.push(...validateFrameConfiguration(definition, path));
      }
    });
    return report(issues);
  }

  public get size(): number {
    return this.#definitions.size;
  }

  public get requiredKeys(): readonly AssetKey[] {
    return [...this.#definitions.values()]
      .filter((definition) => definition.required)
      .map((definition) => definition.key)
      .sort();
  }

  public has(key: AssetKey): boolean {
    return this.#definitions.has(key);
  }

  public get(key: AssetKey): AssetDefinition | undefined {
    return this.#definitions.get(key);
  }

  public require(key: AssetKey): AssetDefinition {
    const definition = this.#definitions.get(key);
    if (definition === undefined) {
      throw new AssetRegistryError('BOOT_ASSET_LOAD_FAILED', [
        issue('UNKNOWN_KEY', key, `loads.${key}`, `Unknown asset key "${key}".`),
      ]);
    }
    return definition;
  }

  public validateLoadedAssets(
    loadedAssets: readonly LoadedAssetMetadata[],
  ): AssetRegistryReport {
    const issues: AssetRegistryIssue[] = [];
    const seen = new Set<AssetKey>();
    for (const loaded of loadedAssets) {
      const definition = this.#definitions.get(loaded.key);
      if (seen.has(loaded.key)) {
        issues.push(
          issue(
            'DUPLICATE_LOAD_RESULT',
            loaded.key,
            `loads.${loaded.key}`,
            `Asset "${loaded.key}" was reported more than once.`,
          ),
        );
      }
      seen.add(loaded.key);
      if (definition === undefined) {
        issues.push(
          issue(
            'UNKNOWN_KEY',
            loaded.key,
            `loads.${loaded.key}`,
            `Unknown asset key "${loaded.key}".`,
          ),
        );
        continue;
      }
      if (definition.type !== loaded.type) {
        issues.push(
          issue(
            'TYPE_MISMATCH',
            loaded.key,
            `loads.${loaded.key}.type`,
            `Expected type "${definition.type}" but received "${loaded.type}".`,
          ),
        );
      }
      if (
        (definition.type === 'image' || definition.type === 'spritesheet') &&
        definition.expectedDimensions !== undefined
      ) {
        const expected = definition.expectedDimensions;
        const actual = loaded.dimensions;
        if (
          actual === undefined ||
          actual.width !== expected.width ||
          actual.height !== expected.height
        ) {
          issues.push(
            issue(
              'DIMENSION_MISMATCH',
              loaded.key,
              `loads.${loaded.key}.dimensions`,
              `Expected ${expected.width}x${expected.height} pixels.`,
            ),
          );
        }
      }
      if (definition.type === 'spritesheet' && loaded.dimensions !== undefined) {
        const gridDimensions =
          definition.expectedDimensions ?? loaded.dimensions;
        const capacity = frameCapacity(definition, gridDimensions);
        const first = definition.frameConfig.startFrame ?? 0;
        const expectedFrames =
          (definition.frameConfig.endFrame ??
            (capacity === null ? -1 : capacity - 1)) -
          first +
          1;
        if (capacity === null || loaded.frameCount !== expectedFrames) {
          issues.push(
            issue(
              'FRAME_COUNT_MISMATCH',
              loaded.key,
              `loads.${loaded.key}.frameCount`,
              `Expected ${expectedFrames} frames from the configured grid.`,
            ),
          );
        }
      }
    }
    for (const definition of this.#definitions.values()) {
      if (definition.required && !seen.has(definition.key)) {
        issues.push(
          issue(
            'MISSING_REQUIRED_ASSET',
            definition.key,
            `loads.${definition.key}`,
            `Required asset "${definition.key}" did not load.`,
          ),
        );
      }
    }
    return report(issues);
  }

  public validateLoadedAssetsOrThrow(
    loadedAssets: readonly LoadedAssetMetadata[],
  ): AssetRegistryReport {
    const validation = this.validateLoadedAssets(loadedAssets);
    if (!validation.valid) {
      throw new AssetRegistryError('BOOT_ASSET_LOAD_FAILED', validation.issues);
    }
    return validation;
  }
}
