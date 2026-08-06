import Phaser from 'phaser';

import { GAME_DIMENSIONS } from '../foundation';

export class LanguageSelectPlaceholderScene extends Phaser.Scene {
  public constructor() {
    super({ key: 'LanguageSelectScene' });
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#07111f');
    this.add
      .text(
        GAME_DIMENSIONS.width / 2,
        GAME_DIMENSIONS.height / 2,
        'LANGUAGE SELECT',
        {
          color: '#69f7ff',
          fontFamily: 'Geist Pixel Square',
          fontSize: '32px',
        },
      )
      .setOrigin(0.5);
  }
}
