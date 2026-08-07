import Phaser from 'phaser';

import { INITIAL_LOCALE_BUNDLES } from '../data';
import { APP_TITLE, GAME_DIMENSIONS } from '../foundation';
import { LocalizationStore } from '../localization/LocalizationStore';
import { SessionSettings } from '../core/SessionSettings';
import type { RunStatistics } from '../types';

const FONT_FAMILY = 'Geist Pixel Square';

const COLORS = {
  background: '#07111f',
  title: '#ff7692',
  stat: '#d8fbff',
  statLabel: '#9eb8c7',
  action: '#69f7ff',
  actionDefault: '#d8fbff',
  panelBg: 0x100916,
  panelBorder: 0xff5577,
} as const;

export class DefeatScene extends Phaser.Scene {
  #settings?: SessionSettings;
  #localization?: LocalizationStore;
  #statistics?: RunStatistics;

  public constructor() {
    super({ key: 'DefeatScene' });
  }

  public init(data: Record<string, unknown>): void {
    if (data['settings'] instanceof SessionSettings) {
      this.#settings = data['settings'];
    } else {
      this.#settings = new SessionSettings();
      this.#settings.setLanguage('es');
    }

    this.#localization = new LocalizationStore(INITIAL_LOCALE_BUNDLES, this.#settings);

    if (data['statistics'] !== undefined && data['statistics'] !== null) {
      this.#statistics = data['statistics'] as RunStatistics;
    }
  }

  public create(): void {
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.createLayout();
    this.setupInput();
  }

  private createLayout(): void {
    const centerX = GAME_DIMENSIONS.width / 2;
    const centerY = GAME_DIMENSIONS.height / 2;

    // Panel
    this.add
      .rectangle(centerX, centerY, 560, 400, COLORS.panelBg, 0.96)
      .setStrokeStyle(3, COLORS.panelBorder);

    // Title
    const title = this.translate('defeat.title');
    this.add
      .text(centerX, centerY - 150, title, {
        color: COLORS.title,
        fontFamily: FONT_FAMILY,
        fontSize: '36px',
      })
      .setOrigin(0.5);

    // Statistics
    const stats = this.#statistics;
    const statY = centerY - 80;
    const lineHeight = 32;

    if (stats !== undefined) {
      const lines = [
        this.translate('defeat.score', { score: stats.finalScore }),
        this.translate('defeat.correct', { count: stats.correctCount }),
        this.translate('defeat.streak', { streak: stats.maxStreak }),
        this.translate('defeat.time', { time: this.formatTime(stats.totalPlayTimeMs) }),
        this.translate('defeat.encounter', { name: stats.furthestEncounterId ?? '—' }),
      ];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line === undefined) continue;
        this.add
          .text(centerX, statY + i * lineHeight, line, {
            color: COLORS.stat,
            fontFamily: FONT_FAMILY,
            fontSize: '18px',
          })
          .setOrigin(0.5);
      }
    }

    // Actions
    const actionY = centerY + 120;

    const restartText = this.add
      .text(centerX - 100, actionY, this.translate('defeat.restart'), {
        color: COLORS.action,
        fontFamily: FONT_FAMILY,
        fontSize: '22px',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const exitText = this.add
      .text(centerX + 100, actionY, this.translate('defeat.exitToMenu'), {
        color: COLORS.actionDefault,
        fontFamily: FONT_FAMILY,
        fontSize: '22px',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    restartText.on('pointerdown', () => this.restartRun());
    exitText.on('pointerdown', () => this.exitToMenu());
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

  private formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  public shutdown(): void {
    if (this.input.keyboard !== null) {
      this.input.keyboard.removeAllListeners();
    }
  }
}
