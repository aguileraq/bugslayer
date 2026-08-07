import Phaser from 'phaser';

import { GAME_DIMENSIONS } from '../foundation';
import { SessionSettings } from '../core/SessionSettings';
import type { Language } from '../types';

const FONT_FAMILY = 'Geist Pixel Square';

const COLORS = {
  background: '#07111f',
  title: '#d8fbff',
  optionDefault: '#9eb8c7',
  optionFocused: '#69f7ff',
  help: '#6b8a99',
  focusOutline: 0x69f7ff,
  focusBackground: 0x0c2a3d,
  panelBackground: 0x061526,
  panelBorder: 0x1b6f8d,
} as const;

interface LanguageOption {
  readonly language: Language;
  readonly label: string;
}

const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { language: 'es', label: 'Español' },
  { language: 'en', label: 'English' },
];

export class LanguageSelectScene extends Phaser.Scene {
  readonly #settings = new SessionSettings();
  #focusIndex = 0;
  #confirmed = false;
  #optionTexts: Phaser.GameObjects.Text[] = [];
  #focusIndicator?: Phaser.GameObjects.Rectangle;
  #titleText?: Phaser.GameObjects.Text;
  #helpText?: Phaser.GameObjects.Text;
  #confirmText?: Phaser.GameObjects.Text;

  public constructor() {
    super({ key: 'LanguageSelectScene' });
  }

  public create(): void {
    this.#confirmed = false;
    this.#focusIndex = 0;
    this.#optionTexts = [];

    this.cameras.main.setBackgroundColor(COLORS.background);
    this.createLayout();
    this.setupInput();
    this.updateFocus();
  }

  private createLayout(): void {
    const centerX = GAME_DIMENSIONS.width / 2;
    const baseY = 140;

    // Panel background
    this.add
      .rectangle(centerX, GAME_DIMENSIONS.height / 2, 480, 340, COLORS.panelBackground, 0.92)
      .setStrokeStyle(2, COLORS.panelBorder);

    // Title — uses fixed Spanish/English label from locale data
    // Before language is set, we show both language names as title
    this.#titleText = this.add
      .text(centerX, baseY, 'Selecciona tu idioma\nSelect your language', {
        align: 'center',
        color: COLORS.title,
        fontFamily: FONT_FAMILY,
        fontSize: '22px',
        lineSpacing: 6,
      })
      .setOrigin(0.5);

    // Focus indicator (rectangle behind focused option)
    this.#focusIndicator = this.add
      .rectangle(centerX, 0, 320, 44, COLORS.focusBackground, 0.8)
      .setStrokeStyle(2, COLORS.focusOutline)
      .setVisible(true);

    // Language options
    const optionStartY = 250;
    const optionSpacing = 60;

    for (let i = 0; i < LANGUAGE_OPTIONS.length; i++) {
      const option = LANGUAGE_OPTIONS[i];
      if (option === undefined) continue;

      const y = optionStartY + i * optionSpacing;
      const text = this.add
        .text(centerX, y, option.label, {
          color: COLORS.optionDefault,
          fontFamily: FONT_FAMILY,
          fontSize: '28px',
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      text.on('pointerdown', () => this.selectByPointer(i));

      this.#optionTexts.push(text);
    }

    // Help text
    this.#helpText = this.add
      .text(
        centerX,
        optionStartY + LANGUAGE_OPTIONS.length * optionSpacing + 30,
        '↑↓  Enter',
        {
          color: COLORS.help,
          fontFamily: FONT_FAMILY,
          fontSize: '14px',
        },
      )
      .setOrigin(0.5);

    // Confirm button (hidden until focus is established)
    this.#confirmText = this.add
      .text(centerX, 430, '', {
        color: COLORS.optionFocused,
        fontFamily: FONT_FAMILY,
        fontSize: '18px',
      })
      .setOrigin(0.5)
      .setVisible(false);
  }

  private setupInput(): void {
    if (this.input.keyboard === null) return;

    this.input.keyboard.on('keydown-UP', () => this.moveFocus(-1));
    this.input.keyboard.on('keydown-DOWN', () => this.moveFocus(1));
    this.input.keyboard.on('keydown-ENTER', () => this.confirmSelection());
    this.input.keyboard.on('keydown-SPACE', () => this.confirmSelection());
  }

  private moveFocus(direction: number): void {
    if (this.#confirmed) return;

    const newIndex = this.#focusIndex + direction;
    if (newIndex < 0 || newIndex >= LANGUAGE_OPTIONS.length) return;

    this.#focusIndex = newIndex;
    this.updateFocus();
  }

  private selectByPointer(index: number): void {
    if (this.#confirmed) return;
    if (index === this.#focusIndex) {
      // Clicking the already-focused option confirms it
      this.confirmSelection();
    } else {
      // Clicking a different option focuses it (requires explicit confirm)
      this.#focusIndex = index;
      this.updateFocus();
    }
  }

  private updateFocus(): void {
    const optionStartY = 250;
    const optionSpacing = 60;

    for (let i = 0; i < this.#optionTexts.length; i++) {
      const text = this.#optionTexts[i];
      if (text === undefined) continue;
      if (i === this.#focusIndex) {
        text.setColor(COLORS.optionFocused);
        text.setFontSize(30);
      } else {
        text.setColor(COLORS.optionDefault);
        text.setFontSize(28);
      }
    }

    // Position focus indicator
    const focusedY = optionStartY + this.#focusIndex * optionSpacing;
    this.#focusIndicator?.setPosition(GAME_DIMENSIONS.width / 2, focusedY);
  }

  private confirmSelection(): void {
    if (this.#confirmed) return;
    this.#confirmed = true;

    const selectedOption = LANGUAGE_OPTIONS[this.#focusIndex];
    if (selectedOption === undefined) return;

    // Persist language to session
    this.#settings.setLanguage(selectedOption.language);

    // Visual confirmation feedback
    const focusedText = this.#optionTexts[this.#focusIndex];
    if (focusedText !== undefined) {
      focusedText.setColor('#ffffff');
    }

    // Brief delay for visual feedback, then transition to office
    this.time.delayedCall(300, () => {
      this.scene.start('OfficeScene', {
        settings: this.#settings,
      });
    });
  }

  public shutdown(): void {
    if (this.input.keyboard !== null) {
      this.input.keyboard.removeAllListeners();
    }
  }
}
