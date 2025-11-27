export class BootLoader extends Phaser.Scene {
  constructor() {
    super({ key: 'BootLoader' });
  }

  create() {
    const graphics = this.add.graphics();
    const color = 0x00ff00; // Green color
    const size = 20;

    //snake
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, size, size);
    graphics.generateTexture('snakeTexture', size, size);
    graphics.clear();

    //food
    graphics.fillStyle(0xffff00, 1);
    graphics.fillRect(0, 0, size, size);
    graphics.generateTexture('foodTexture', size / 2, size / 2);
    graphics.clear();

    this.scene.start('SquareScene');
  }
}
