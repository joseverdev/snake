export class Meal {
  constructor(scene) {
    this.scene = scene;
    this.tileSize = 20;

    this.gameWidth = this.scene.sys.game.config.width;
    this.gameHeight = this.scene.sys.game.config.height;

    this.item = this.scene.physics.add
      .image(-100, -100, 'foodTexture')
      .setOrigin(0);
  }

  spawn(snakeBody) {
    let validPosition = false;
    let x, y;

    const cols = Math.floor(this.gameWidth / this.tileSize);
    const rows = Math.floor(this.gameHeight / this.tileSize);

    while (!validPosition) {
      x = Phaser.Math.Between(0, cols - 1) * this.tileSize;
      y = Phaser.Math.Between(0, rows - 1) * this.tileSize;

      validPosition = true;

      for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i].tx === x && snakeBody[i].ty === y) {
          validPosition = false;
          break;
        }
      }
    }
    this.item.setPosition(x, y);
  }
}
