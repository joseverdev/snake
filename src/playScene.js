import { Meal } from './gameObjects/meal';
import { Snake } from './gameObjects/snake';

export class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SquareScene' });
  }

  preload() {}

  create() {
    const WIDTH = this.sys.game.config.width;
    const HEIGHT = this.sys.game.config.height;

    this.snake = new Snake(this);
    this.meal = new Meal(this);

    this.meal.spawn(this.snake.body);

    this.highScore = this.loadHighScore();

    this.score = 0;
    this.scoreIncrement = 10;

    this.scoreText = this.add
      .text(WIDTH - 20, 20, 'Puntaje : 0', { fontSize: '18px', fill: '#FFF' })
      .setOrigin(1, 0);

    this.startText = this.add
      .text(
        WIDTH / 2,
        HEIGHT / 2,
        `Toca la pantalla\nMayor puntaje: ${this.highScore}`,
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

  loadHighScore() {
    const score = localStorage.getItem('snakeHighScore');
    const parseScore = score ? parseInt(score, 10) : 0;
    return parseScore;
  }
  saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      try {
        localStorage.setItem('snakeHighScore', this.highScore.toString());
      } catch (error) {
        console.error('Error saving high score to localStorage:', error);
      }
    }
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

  updateScore() {
    this.score += this.scoreIncrement;
    this.scoreText.setText('Puntaje : ' + this.score);
  }

  update(time, delta) {
    this.snake.update(time);

    if (
      this.snake.body[0].tx === this.meal.item.x &&
      this.snake.body[0].ty === this.meal.item.y
    ) {
      this.snake.grows();
      this.updateScore();
      this.meal.spawn(this.snake.body);
    }
  }
}
