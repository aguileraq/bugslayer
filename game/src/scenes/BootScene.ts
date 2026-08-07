import Phaser from 'phaser';

import {
  AssetRegistry,
  assetManifest,
  type LoadedAssetMetadata,
} from '../assets';
import { BootController, loadLocalFont, type BootFailure } from '../boot';
import { INITIAL_LOCALE_BUNDLES, INITIAL_LOCALES } from '../data';
import { GAME_DIMENSIONS } from '../foundation';
import type { AssetDefinition, FontAssetDefinition } from '../types';

const MENU_SCENE_KEY = 'MenuScene';
const BOOT_BACKGROUND_KEY = 'ui.boot.background';
const FONT_KEY = 'font.geist-pixel-square';
const FALLBACK_FONT = 'monospace';

function interpolate(
  message: string,
  parameters: Readonly<Record<string, string | number>>,
): string {
  return message.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g, (_token, key: string) =>
    String(parameters[key]),
  );
}

function requiredDefinitions(): readonly AssetDefinition[] {
  return assetManifest.assets.filter((definition) => definition.required);
}

function fontDefinition(): FontAssetDefinition {
  const definition = assetManifest.assets.find(
    (asset): asset is FontAssetDefinition =>
      asset.key === FONT_KEY && asset.type === 'font',
  );
  if (definition === undefined) {
    throw new Error(`Required font definition "${FONT_KEY}" is missing.`);
  }
  return definition;
}

export class BootScene extends Phaser.Scene {
  readonly #registry = new AssetRegistry(assetManifest);
  #progressText?: Phaser.GameObjects.Text;
  #progressBar?: Phaser.GameObjects.Rectangle;
  #progressTrack?: Phaser.GameObjects.Rectangle;
  #backgroundAdded = false;

  public constructor() {
    super({ key: 'BootScene' });
  }

  public preload(): void {
    this.createLoadingView();
    this.load.on(Phaser.Loader.Events.PROGRESS, this.handleProgress, this);
    this.load.on(Phaser.Loader.Events.FILE_COMPLETE, this.handleFileComplete, this);

    for (const definition of requiredDefinitions()) {
      this.queueDefinition(definition);
    }
  }

  public create(): void {
    this.load.off(Phaser.Loader.Events.PROGRESS, this.handleProgress, this);
    this.load.off(
      Phaser.Loader.Events.FILE_COMPLETE,
      this.handleFileComplete,
      this,
    );
    void this.finalizeBoot();
  }

  private createLoadingView(): void {
    const centerX = GAME_DIMENSIONS.width / 2;
    const centerY = GAME_DIMENSIONS.height / 2;
    this.cameras.main.setBackgroundColor('#030812');

    this.add
      .rectangle(centerX, centerY, GAME_DIMENSIONS.width, GAME_DIMENSIONS.height, 0x030812)
      .setDepth(-2);
    this.add
      .rectangle(centerX, centerY + 82, 448, 80, 0x061526, 0.94)
      .setStrokeStyle(2, 0x1b6f8d)
      .setDepth(1);
    this.#progressTrack = this.add
      .rectangle(centerX, centerY + 102, 360, 12, 0x10293b)
      .setStrokeStyle(1, 0x2f7892)
      .setDepth(2);
    this.#progressBar = this.add
      .rectangle(centerX - 180, centerY + 102, 0, 8, 0x69f7ff)
      .setOrigin(0, 0.5)
      .setDepth(3);
    this.#progressText = this.add
      .text(centerX, centerY + 74, this.loadingMessage(0), {
        color: '#d8fbff',
        fontFamily: FALLBACK_FONT,
        fontSize: '18px',
      })
      .setOrigin(0.5)
      .setDepth(3);
  }

  private loadingMessage(progress: number): string {
    return interpolate(INITIAL_LOCALES.es['boot.loading'], { progress });
  }

  private handleProgress(progress: number): void {
    const percentage = Math.round(progress * 100);
    this.#progressText?.setText(this.loadingMessage(percentage));
    this.#progressBar?.setSize(Math.round(360 * progress), 8);
  }

  private handleFileComplete(key: string): void {
    if (key !== BOOT_BACKGROUND_KEY || this.#backgroundAdded) return;
    this.#backgroundAdded = true;
    this.add
      .image(GAME_DIMENSIONS.width / 2, GAME_DIMENSIONS.height / 2, key)
      .setDepth(-1);
  }

  private queueDefinition(definition: AssetDefinition): void {
    switch (definition.type) {
      case 'font':
        return;
      case 'image':
        this.load.image(definition.key, definition.url);
        return;
      case 'spritesheet':
        this.load.spritesheet(definition.key, definition.url, {
          ...definition.frameConfig,
        });
        return;
      case 'tilemap':
        this.load.tilemapTiledJSON(definition.key, definition.url);
        return;
      case 'json':
        this.load.json(definition.key, definition.url);
    }
  }

  private collectLoadedAssets(): readonly LoadedAssetMetadata[] {
    const loaded: LoadedAssetMetadata[] = [];
    for (const definition of requiredDefinitions()) {
      if (definition.type === 'font') {
        loaded.push({ key: definition.key, type: definition.type });
        continue;
      }
      if (definition.type === 'image' || definition.type === 'spritesheet') {
        if (!this.textures.exists(definition.key)) continue;
        const texture = this.textures.get(definition.key);
        const source = texture.source[0];
        if (source === undefined) continue;
        const metadata: LoadedAssetMetadata = {
          key: definition.key,
          type: definition.type,
          dimensions: { width: source.width, height: source.height },
          ...(definition.type === 'spritesheet'
            ? { frameCount: texture.getFrameNames(false).length }
            : {}),
        };
        loaded.push(metadata);
        continue;
      }
      const cache = definition.type === 'tilemap' ? this.cache.tilemap : this.cache.json;
      if (cache.exists(definition.key)) {
        loaded.push({ key: definition.key, type: definition.type });
      }
    }
    return loaded;
  }

  private async finalizeBoot(): Promise<void> {
    const font = fontDefinition();
    const controller = new BootController({
      registry: this.#registry,
      locales: INITIAL_LOCALE_BUNDLES,
      loadedAssets: () => this.collectLoadedAssets(),
      loadFont: () => loadLocalFont(font),
      onReady: () => this.scene.start(MENU_SCENE_KEY),
    });
    const result = await controller.run();
    if (!result.ok) this.showBlockingError(result);
  }

  private showBlockingError(failure: BootFailure): void {
    console.error(`[${failure.code}]`, ...failure.details);
    this.#progressText?.destroy();
    this.#progressBar?.destroy();
    this.#progressTrack?.destroy();

    const centerX = GAME_DIMENSIONS.width / 2;
    const centerY = GAME_DIMENSIONS.height / 2;
    this.add
      .rectangle(centerX, centerY, 640, 220, 0x100916, 0.96)
      .setStrokeStyle(3, 0xff5577)
      .setDepth(4);
    this.add
      .text(centerX, centerY - 62, INITIAL_LOCALES.es['boot.error.title'], {
        color: '#ff7692',
        fontFamily: FALLBACK_FONT,
        fontSize: '28px',
      })
      .setOrigin(0.5)
      .setDepth(5);
    this.add
      .text(
        centerX,
        centerY - 8,
        interpolate(INITIAL_LOCALES.es['boot.error.detail'], {
          errorId: failure.code,
        }),
        {
          align: 'center',
          color: '#f5e8ee',
          fontFamily: FALLBACK_FONT,
          fontSize: '18px',
        },
      )
      .setOrigin(0.5)
      .setDepth(5);
    this.add
      .text(centerX, centerY + 52, INITIAL_LOCALES.es['boot.error.retry'], {
        color: '#9eb8c7',
        fontFamily: FALLBACK_FONT,
        fontSize: '16px',
      })
      .setOrigin(0.5)
      .setDepth(5);
  }
}
