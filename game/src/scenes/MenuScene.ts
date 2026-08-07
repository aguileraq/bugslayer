import Phaser from 'phaser';

import { INITIAL_LOCALE_BUNDLES } from '../data';
import { APP_TITLE, GAME_DIMENSIONS } from '../foundation';
import { LocalizationStore } from '../localization/LocalizationStore';
import { SessionSettings } from '../core/SessionSettings';

const FONT_FAMILY = 'Geist Pixel Square';

const COLORS = {
  background: '#07111f',
  title: '#69f7ff',
  titleGlow: '#2ad4e0',
  action: '#d8fbff',
  actionFocused: '#69f7ff',
  actionPressed: '#ffffff',
  subtitle: '#6b8a99',
  panelBackground: 0x061526,
  panelBorder: 0x1b6f8d,
  focusOutline: 0x69f7ff,
  focusBackground: 0x0c2a3d,
} as const;

export class MenuScene extends Phaser.Scene {
  #settings?: SessionSettings;
  #localization?: LocalizationStore;
  #startText?: Phaser.GameObjects.Text;
  #focusIndicator?: Phaser.GameObjects.Rectangle;
  #actionActivated = false;

  public constructor() {
    super({ key: 'MenuScene' });
  }

  public init(data: Record<string, unknown>): void {
    if (data['settings'] instanceof SessionSettings) {
      this.#settings = data['settings'];
    } else {
      // Fallback: create new settings (should not happen in normal flow)
      this.#settings = new SessionSettings();
    }

    this.#localization = new LocalizationStore(
      INITIAL_LOCALE_BUNDLES,
      this.#settings,
    );
  }

  public create(): void {
    this.#actionActivated = false;
    this.cameras.main.setBackgroundColor(COLORS.background);

    this.createLayout();
    this.setupInput();
  }

  private createLayout(): void {
    const centerX = GAME_DIMENSIONS.width / 2;

    // Panel background
    this.add
      .rectangle(centerX, GAME_DIMENSIONS.height / 2, 520, 380, COLORS.panelBackground, 0.9)
      .setStrokeStyle(2, COLORS.panelBorder);

    // Game title
    const title = this.translate('menu.title', { productTitle: APP_TITLE });
    this.add
      .text(centerX, 170, title, {
        color: COLORS.title,
        fontFamily: FONT_FAMILY,
        fontSize: '48px',
      })
      .setOrigin(0.5);

    // Focus indicator for start button
    this.#focusIndicator = this.add
      .rectangle(centerX, 340, 300, 52, COLORS.focusBackground, 0.8)
      .setStrokeStyle(2, COLORS.focusOutline);

    // Start action
    const startLabel = this.translate('menu.start');
    this.#startText = this.add
      .text(centerX, 340, startLabel, {
        color: COLORS.actionFocused,
        fontFamily: FONT_FAMILY,
        fontSize: '26px',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.#startText.on('pointerover', () => {
      if (!this.#actionActivated) {
        this.#startText?.setColor(COLORS.actionFocused);
      }
    });

    this.#startText.on('pointerout', () => {
      if (!this.#actionActivated) {
        this.#startText?.setColor(COLORS.action);
      }
    });

    this.#startText.on('pointerdown', () => this.activateStart());

    // Language indicator (subtle)
    const languageLabel = this.#settings?.language === 'es' ? 'Español' : 'English';
    this.add
      .text(centerX, 430, languageLabel, {
        color: COLORS.subtitle,
        fontFamily: FONT_FAMILY,
        fontSize: '14px',
      })
      .setOrigin(0.5);
  }

  private setupInput(): void {
    if (this.input.keyboard === null) return;

    this.input.keyboard.on('keydown-ENTER', () => this.activateStart());
    this.input.keyboard.on('keydown-SPACE', () => this.activateStart());
  }

  private activateStart(): void {
    if (this.#actionActivated) return;
    this.#actionActivated = true;

    // Visual feedback
    this.#startText?.setColor(COLORS.actionPressed);

    // Emit startRun — transition to OfficeScene
    this.time.delayedCall(200, () => {
      this.events.emit('startRun');
      this.scene.start('OfficeScene', { settings: this.#settings });
    });
  }

  private translate(
    key: string,
    parameters?: Readonly<Record<string, string | number | boolean>>,
  ): string {
    if (this.#localization === undefined) return key;
    return this.#localization.translate(key, parameters);
  }

  public shutdown(): void {
    if (this.input.keyboard !== null) {
      this.input.keyboard.removeAllListeners();
    }
  }
}
