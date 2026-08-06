import Phaser from 'phaser';

import { APP_TITLE, GAME_DIMENSIONS } from '../foundation';

export class FoundationScene extends Phaser.Scene {
  public constructor() {
    super({ key: 'FoundationScene' });
  }

  public create(): void {
    const centerX = GAME_DIMENSIONS.width / 2;
    const centerY = GAME_DIMENSIONS.height / 2;

    this.add
      .text(centerX, centerY - 16, APP_TITLE, {
        color: '#69f7ff',
        fontFamily: 'monospace',
        fontSize: '32px',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY + 28, 'TASK-101 · FOUNDATION READY', {
        color: '#8ea7b8',
        fontFamily: 'monospace',
        fontSize: '14px',
      })
      .setOrigin(0.5);
  }
}
