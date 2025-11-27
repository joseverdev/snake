import { Meal } from './gameObjects/meal';
import { Snake } from './gameObjects/snake';

export class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SquareScene' });
  }

  preload() {}

  create() {
    this.snake = new Snake(this);
    this.meal = new Meal(this);

    this.meal.spawn(this.snake.body);

    this.startText = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2,
        'Toca la pantalla',
        { fontSize: '18px', fill: '#FFF' }
      )
      .setOrigin(0.5);

    this.input.keyboard.on('keydown', this.handleStartGame, this);
    this.input.on('pointerup', this.handleStartGame, this);

    this.input.keyboard.on('keydown-RIGHT', () => {
      this.snake.changeMov('RIGHT');
    });

    this.input.keyboard.on('keydown-LEFT', () => {
      this.snake.changeMov('LEFT');
    });

    this.input.keyboard.on('keydown-UP', () => {
      this.snake.changeMov('UP');
    });

    this.input.keyboard.on('keydown-DOWN', () => {
      this.snake.changeMov('DOWN');
    });

    this.input.on('pointerup', this.handleSwipe, this);
  }

  handleStartGame(pointer) {
    if (this.snake.isActive) {
      if (pointer) {
        this.handleSwipe(pointer);
      }
      return;
    }

    if (this.startText) {
      this.startText.destroy();
      this.startText = null;
    }

    this.snake.startGame();

    if (pointer) {
      this.handleSwipe(pointer);
    }
  }

  handleSwipe(pointer) {
    const swipeThreshold = 30;

    const diffX = pointer.x - pointer.downX;
    const diffY = pointer.y - pointer.downY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        this.snake.changeMov('RIGHT');
      } else {
        this.snake.changeMov('LEFT');
      }
    } else {
      if (Math.abs(diffY) > swipeThreshold) {
        if (diffY > 0) {
          this.snake.changeMov('DOWN');
        } else {
          this.snake.changeMov('UP');
        }
      }
    }
  }

  update(time, delta) {
    this.snake.update(time);

    if (
      this.snake.body[0].tx === this.meal.item.x &&
      this.snake.body[0].ty === this.meal.item.y
    ) {
      this.snake.grows();
      this.meal.spawn(this.snake.body);
    }
  }
}
