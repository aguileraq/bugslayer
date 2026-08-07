import Phaser from 'phaser';

import { GAME_DIMENSIONS } from './foundation';
import { BootScene } from './scenes/BootScene';
import { LanguageSelectScene } from './scenes/LanguageSelectScene';
import { MenuScene } from './scenes/MenuScene';
import { OfficeScene } from './scenes/OfficeScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_DIMENSIONS.width,
  height: GAME_DIMENSIONS.height,
  backgroundColor: '#07111f',
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_DIMENSIONS.width,
    height: GAME_DIMENSIONS.height,
  },
  scene: [BootScene, LanguageSelectScene, MenuScene, OfficeScene],
};
