import {
  AssetRegistry,
  AssetRegistryError,
  type LoadedAssetMetadata,
} from '../assets';
import {
  LocalizationError,
  validateLocaleBundles,
} from '../localization';
import type { LocaleBundle } from '../types';

export const BOOT_ERROR_CODES = [
  'BOOT_ASSET_LOAD_FAILED',
  'BOOT_FONT_LOAD_FAILED',
  'BOOT_MANIFEST_INVALID',
  'BOOT_DATA_INVALID',
  'BOOT_LOCALE_INVALID',
  'BOOT_UNEXPECTED_ERROR',
] as const;

export type BootErrorCode = (typeof BOOT_ERROR_CODES)[number];

export interface BootFailure {
  readonly ok: false;
  readonly code: BootErrorCode;
  readonly details: readonly string[];
}

export interface BootSuccess {
  readonly ok: true;
}

export type BootResult = BootFailure | BootSuccess;

export interface BootControllerDependencies {
  readonly registry: AssetRegistry;
  readonly locales: readonly LocaleBundle[];
  readonly loadedAssets: () => readonly LoadedAssetMetadata[];
  readonly loadFont: () => Promise<void>;
  readonly onReady: () => void;
}

function failure(
  code: BootErrorCode,
  details: readonly string[],
): BootFailure {
  return { ok: false, code, details: [...details].sort() };
}

function normalizeError(error: unknown): BootFailure {
  if (error instanceof AssetRegistryError) {
    return failure(
      error.code,
      error.issues.map((issue) => `${issue.path}: ${issue.message}`),
    );
  }
  if (error instanceof LocalizationError) {
    return failure(
      error.code,
      error.issues.map(
        (issue) => `${issue.language}.${issue.key}: ${issue.message}`,
      ),
    );
  }
  if (error instanceof BootFontError) {
    return failure(error.code, [error.message]);
  }
  if (error instanceof Error) {
    return failure('BOOT_UNEXPECTED_ERROR', [error.message]);
  }
  return failure('BOOT_UNEXPECTED_ERROR', ['Unknown startup failure.']);
}

export class BootFontError extends Error {
  public override readonly name = 'BootFontError';
  public readonly code = 'BOOT_FONT_LOAD_FAILED';

  public constructor(message: string) {
    super(message);
  }
}

export class BootController {
  readonly #dependencies: BootControllerDependencies;
  #result: BootResult | null = null;
  #running = false;

  public constructor(dependencies: BootControllerDependencies) {
    this.#dependencies = dependencies;
  }

  public get result(): BootResult | null {
    return this.#result;
  }

  public async run(): Promise<BootResult> {
    if (this.#running || this.#result !== null) {
      throw new Error('BootController can only run once.');
    }
    this.#running = true;

    try {
      const localeReport = validateLocaleBundles(this.#dependencies.locales);
      if (!localeReport.valid) {
        throw new LocalizationError(localeReport.issues);
      }

      await this.#dependencies.loadFont();
      this.#dependencies.registry.validateLoadedAssetsOrThrow(
        this.#dependencies.loadedAssets(),
      );
      this.#dependencies.onReady();
      this.#result = { ok: true };
    } catch (error) {
      this.#result = normalizeError(error);
    } finally {
      this.#running = false;
    }

    return this.#result;
  }
}
