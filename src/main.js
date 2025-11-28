import Phaser, { Physics } from 'phaser';
import { BootLoader } from './bootLoader';
import { PlayScene } from './playScene';

const config = {
  type: Phaser.AUTO,
  width: 340,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  backgroundColor: '#2b2b2b',
  height: 640,
  scene: [BootLoader, PlayScene],
};

const Game = new Phaser.Game(config);
