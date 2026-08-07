import Phaser from 'phaser';

import { INITIAL_LOCALE_BUNDLES } from '../data';
import { APP_TITLE, GAME_DIMENSIONS } from '../foundation';
import { LocalizationStore } from '../localization/LocalizationStore';
import { SessionSettings } from '../core/SessionSettings';

const FONT_FAMILY = 'Geist Pixel Square';
const DEMO_END_CARD_KEY = 'ui.demo-end.card';

const COLORS = {
  title: '#69f7ff',
  thanks: '#d8fbff',
  action: '#9eb8c7',
  actionFocused: '#69f7ff',
} as const;

export class DemoEndScene extends Phaser.Scene {
  #settings?: SessionSettings;
  #localization?: LocalizationStore;

  public constructor() {
    super({ key: 'DemoEndScene' });
  }

  public init(data: Record<string, unknown>): void {
    if (data['settings'] instanceof SessionSettings) {
      this.#settings = data['settings'];
    } else {
      this.#settings = new SessionSettings();
      this.#settings.setLanguage('es');
    }

    this.#localization = new LocalizationStore(INITIAL_LOCALE_BUNDLES, this.#settings);
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#030812');

    // Demo end card background
    if (this.textures.exists(DEMO_END_CARD_KEY)) {
      this.add
        .image(GAME_DIMENSIONS.width / 2, GAME_DIMENSIONS.height / 2, DEMO_END_CARD_KEY)
        .setDisplaySize(GAME_DIMENSIONS.width, GAME_DIMENSIONS.height);
    }

    this.createOverlay();
    this.setupInput();
  }

  private createOverlay(): void {
    const centerX = GAME_DIMENSIONS.width / 2;

    // Title
    this.add
      .text(centerX, 180, this.translate('demoEnd.title'), {
        color: COLORS.title,
        fontFamily: FONT_FAMILY,
        fontSize: '36px',
      })
      .setOrigin(0.5);

    // Thanks message
    this.add
      .text(centerX, 260, this.translate('demoEnd.thanks'), {
        align: 'center',
        color: COLORS.thanks,
        fontFamily: FONT_FAMILY,
        fontSize: '18px',
        wordWrap: { width: 700 },
      })
      .setOrigin(0.5);

    // Actions
    const restartText = this.add
      .text(centerX - 120, 400, this.translate('demoEnd.restart'), {
        color: COLORS.actionFocused,
        fontFamily: FONT_FAMILY,
        fontSize: '20px',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const menuText = this.add
      .text(centerX + 120, 400, this.translate('demoEnd.exitToMenu'), {
        color: COLORS.action,
        fontFamily: FONT_FAMILY,
        fontSize: '20px',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    restartText.on('pointerdown', () => this.restartRun());
    menuText.on('pointerdown', () => this.exitToMenu());
  }

  private setupInput(): void {
    if (this.input.keyboard === null) return;
    this.input.keyboard.on('keydown-ENTER', () => this.restartRun());
    this.input.keyboard.on('keydown-ESCAPE', () => this.exitToMenu());
  }

  private restartRun(): void {
    this.scene.start('OfficeScene', { settings: this.#settings });
  }

  private exitToMenu(): void {
    this.scene.start('MenuScene', { settings: this.#settings });
  }

  private translate(key: string, params?: Readonly<Record<string, string | number | boolean>>): string {
    if (this.#localization === undefined) return key;
    return this.#localization.translate(key, params);
  }

  public shutdown(): void {
    if (this.input.keyboard !== null) {
      this.input.keyboard.removeAllListeners();
    }
  }
}
