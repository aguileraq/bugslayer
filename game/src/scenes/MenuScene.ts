import Phaser from 'phaser';

import { SessionSettings } from '../core/SessionSettings';
import { INITIAL_LOCALE_BUNDLES } from '../data';
import { GAME_DIMENSIONS } from '../foundation';
import { LocalizationStore } from '../localization/LocalizationStore';

const FONT_FAMILY = 'Geist Pixel Square';
const BACKGROUND_KEY = 'ui.menu.background';

const COLORS = {
  background: '#02070d',
  action: '#9eb8c7',
  actionFocused: '#69f7ff',
  actionPressed: '#ffffff',
  buttonFill: 0x061526,
  buttonFocusedFill: 0x0c2a3d,
} as const;

const MENU_ACTIONS = [
  { id: 'start', localizationKey: 'menu.start', y: 353 },
  { id: 'changeLanguage', localizationKey: 'menu.changeLanguage', y: 429 },
] as const;

type MenuActionId = (typeof MENU_ACTIONS)[number]['id'];

export class MenuScene extends Phaser.Scene {
  #settings = new SessionSettings();
  #localization?: LocalizationStore;
  #focusIndex = 0;
  #actionActivated = false;
  readonly #actionTexts: Phaser.GameObjects.Text[] = [];
  readonly #actionHitAreas: Phaser.GameObjects.Rectangle[] = [];

  public constructor() {
    super({ key: 'MenuScene' });
  }

  public init(data: Record<string, unknown>): void {
    this.#settings =
      data['settings'] instanceof SessionSettings
        ? data['settings']
        : new SessionSettings();
    if (!this.#settings.hasLanguage) this.#settings.setLanguage('es');
    this.#localization = new LocalizationStore(
      INITIAL_LOCALE_BUNDLES,
      this.#settings,
    );
  }

  public create(): void {
    this.#focusIndex = 0;
    this.#actionActivated = false;
    this.#actionTexts.length = 0;
    this.#actionHitAreas.length = 0;
    this.cameras.main.setBackgroundColor(COLORS.background);

    this.createLayout();
    this.setupInput();
    this.updateFocus();
  }

  private createLayout(): void {
    const centerX = GAME_DIMENSIONS.width / 2;

    if (this.textures.exists(BACKGROUND_KEY)) {
      this.add
        .image(centerX, GAME_DIMENSIONS.height / 2, BACKGROUND_KEY)
        .setDisplaySize(GAME_DIMENSIONS.width, GAME_DIMENSIONS.height)
        .setDepth(0);
    }

    for (let index = 0; index < MENU_ACTIONS.length; index++) {
      const action = MENU_ACTIONS[index];
      if (action === undefined) continue;

      const hitArea = this.add
        .rectangle(
          centerX,
          action.y,
          364,
          46,
          COLORS.buttonFill,
          0.24,
        )
        .setDepth(1)
        .setInteractive({ useHandCursor: true });
      hitArea.on('pointerover', () => this.focusByPointer(index));
      hitArea.on('pointerdown', () => this.activateByPointer(index));

      const text = this.add
        .text(centerX, action.y, this.translate(action.localizationKey), {
          color: COLORS.action,
          fontFamily: FONT_FAMILY,
          fontSize: index === 0 ? '26px' : '22px',
        })
        .setOrigin(0.5)
        .setDepth(2);

      this.#actionHitAreas.push(hitArea);
      this.#actionTexts.push(text);
    }
  }

  private setupInput(): void {
    if (this.input.keyboard === null) return;

    this.input.keyboard.on('keydown-UP', () => this.moveFocus(-1));
    this.input.keyboard.on('keydown-DOWN', () => this.moveFocus(1));
    this.input.keyboard.on('keydown-ENTER', () => this.activateFocused());
    this.input.keyboard.on('keydown-SPACE', () => this.activateFocused());
  }

  private moveFocus(direction: number): void {
    if (this.#actionActivated) return;
    const nextIndex = Phaser.Math.Clamp(
      this.#focusIndex + direction,
      0,
      MENU_ACTIONS.length - 1,
    );
    if (nextIndex === this.#focusIndex) return;
    this.#focusIndex = nextIndex;
    this.updateFocus();
  }

  private focusByPointer(index: number): void {
    if (this.#actionActivated || index === this.#focusIndex) return;
    this.#focusIndex = index;
    this.updateFocus();
  }

  private activateByPointer(index: number): void {
    if (this.#actionActivated) return;
    this.#focusIndex = index;
    this.updateFocus();
    this.activateFocused();
  }

  private updateFocus(): void {
    for (let index = 0; index < MENU_ACTIONS.length; index++) {
      const focused = index === this.#focusIndex;
      this.#actionTexts[index]?.setColor(
        focused ? COLORS.actionFocused : COLORS.action,
      );
      this.#actionHitAreas[index]?.setFillStyle(
        focused ? COLORS.buttonFocusedFill : COLORS.buttonFill,
        focused ? 0.72 : 0.24,
      );
    }
  }

  private activateFocused(): void {
    if (this.#actionActivated) return;
    const action = MENU_ACTIONS[this.#focusIndex];
    if (action === undefined) return;

    this.#actionActivated = true;
    this.#actionTexts[this.#focusIndex]?.setColor(COLORS.actionPressed);
    this.time.delayedCall(160, () => this.activateAction(action.id));
  }

  private activateAction(action: MenuActionId): void {
    if (action === 'changeLanguage') {
      this.scene.start('LanguageSelectScene', { settings: this.#settings });
      return;
    }

    this.events.emit('startRun');
    this.scene.start('OfficeScene', { settings: this.#settings });
  }

  private translate(key: string): string {
    return this.#localization?.translate(key) ?? key;
  }

  public shutdown(): void {
    if (this.input.keyboard !== null) {
      this.input.keyboard.removeAllListeners();
    }
  }
}
