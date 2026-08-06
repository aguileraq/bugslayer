import { describe, expect, it, vi } from 'vitest';

import { AssetRegistry, type LoadedAssetMetadata } from '../../src/assets';
import {
  BootController,
  BootFontError,
  type BootResult,
} from '../../src/boot';
import type { AssetManifest, LocaleBundle } from '../../src/types';

const manifest = {
  version: '1',
  assets: [
    {
      key: 'font.geist-pixel-square',
      type: 'font',
      category: 'font',
      url: 'assets/fonts/GeistPixel-Square.woff2',
      required: true,
      family: 'Geist Pixel Square',
    },
    {
      key: 'ui.boot.background',
      type: 'image',
      category: 'ui',
      url: 'assets/ui/boot.png',
      required: true,
      expectedDimensions: { width: 960, height: 540 },
    },
  ],
} satisfies AssetManifest;

const locales = [
  { language: 'es', messages: { 'boot.loading': 'Cargando {progress}%' } },
  { language: 'en', messages: { 'boot.loading': 'Loading {progress}%' } },
] satisfies readonly LocaleBundle[];

const completeLoads = [
  { key: 'font.geist-pixel-square', type: 'font' },
  {
    key: 'ui.boot.background',
    type: 'image',
    dimensions: { width: 960, height: 540 },
  },
] satisfies readonly LoadedAssetMetadata[];

function controller(
  overrides: Partial<{
    readonly locales: readonly LocaleBundle[];
    readonly loadedAssets: readonly LoadedAssetMetadata[];
    readonly loadFont: () => Promise<void>;
    readonly onReady: () => void;
  }> = {},
): { readonly boot: BootController; readonly onReady: ReturnType<typeof vi.fn> } {
  const onReady = vi.fn(overrides.onReady);
  return {
    boot: new BootController({
      registry: new AssetRegistry(manifest),
      locales: overrides.locales ?? locales,
      loadedAssets: () => overrides.loadedAssets ?? completeLoads,
      loadFont: overrides.loadFont ?? (() => Promise.resolve()),
      onReady,
    }),
    onReady,
  };
}

describe('BootController', () => {
  it('transitions exactly once after locales, font and required assets are valid', async () => {
    const { boot, onReady } = controller();

    await expect(boot.run()).resolves.toEqual({ ok: true });
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(boot.result).toEqual({ ok: true });
    await expect(boot.run()).rejects.toThrow('can only run once');
  });

  it('blocks the transition when a required resource is absent', async () => {
    const { boot, onReady } = controller({
      loadedAssets: completeLoads.filter(
        (asset) => asset.key !== 'ui.boot.background',
      ),
    });

    const result: BootResult = await boot.run();

    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        code: 'BOOT_ASSET_LOAD_FAILED',
      }),
    );
    expect(result.ok ? [] : result.details).toEqual([
      'loads.ui.boot.background: Required asset "ui.boot.background" did not load.',
    ]);
    expect(onReady).not.toHaveBeenCalled();
  });

  it('blocks the transition when Geist Pixel Square is unavailable', async () => {
    const { boot, onReady } = controller({
      loadFont: () =>
        Promise.reject(new BootFontError('Geist Pixel Square unavailable.')),
    });

    await expect(boot.run()).resolves.toEqual({
      ok: false,
      code: 'BOOT_FONT_LOAD_FAILED',
      details: ['Geist Pixel Square unavailable.'],
    });
    expect(onReady).not.toHaveBeenCalled();
  });

  it('blocks incomplete bilingual data before loading the font', async () => {
    const loadFont = vi.fn(() => Promise.resolve());
    const { boot, onReady } = controller({
      locales: [locales[0]!],
      loadFont,
    });

    const result = await boot.run();

    expect(result).toEqual(
      expect.objectContaining({ ok: false, code: 'BOOT_LOCALE_INVALID' }),
    );
    expect(loadFont).not.toHaveBeenCalled();
    expect(onReady).not.toHaveBeenCalled();
  });
});
