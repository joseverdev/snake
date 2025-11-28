export class Snake {
  constructor(scene) {
    this.scene = scene;
    this.body = [];
    this.dir = 'LEFT';
    this.nextDir = 'LEFT';
    this.tileSize = 20;

    this.moveTime = 0;
    this.moveDelay = 300; // Ajusta esto para velocidad (menos es más rápido)

    this.width = this.scene.sys.game.config.width;
    this.height = this.scene.sys.game.config.height;

    this.isActive = false;

    // --- CREACIÓN ---
    for (let i = 0; i < 3; i++) {
      const x = 100 + i * this.tileSize;
      const y = 100;

      const segment = this.scene.physics.add
        .sprite(x, y, 'snakeTexture')
        .setOrigin(0);

      // Variables para interpolación (Separa Lógica de Visual)
      segment.tx = x; // Target (Destino)
      segment.ty = y;
      segment.px = x; // Previous (Anterior)
      segment.py = y;

      this.body.push(segment);
    }
  }

  startGame() {
    this.isActive = true;
  }

  changeMov(newDir) {
    if (!this.isActive) {
      this.startGame();
    }
    if (
      (this.dir === 'LEFT' && newDir !== 'RIGHT') ||
      (this.dir === 'RIGHT' && newDir !== 'LEFT') ||
      (this.dir === 'UP' && newDir !== 'DOWN') ||
      (this.dir === 'DOWN' && newDir !== 'UP')
    ) {
      this.nextDir = newDir;
    }
  }

  crash() {
    console.log('💥 CRASH!');
    this.scene.saveHighScore();
    this.scene.scene.restart();
  }

  update(time) {
    if (!this.isActive) {
      return;
    }
    // ==========================================================
    // FASE 1: LÓGICA DEL JUEGO (Se ejecuta cada "moveDelay" ms)
    // ==========================================================
    if (time >= this.moveTime) {
      // 1. Preparamos el siguiente ciclo
      this.moveTime = time + this.moveDelay;
      this.dir = this.nextDir;

      // 2. Calcular el destino de la cabeza (TARGET)
      // Usamos .tx y .ty porque son la verdad absoluta de la grilla
      let nextX = this.body[0].tx;
      let nextY = this.body[0].ty;

      switch (this.dir) {
        case 'RIGHT':
          nextX += this.tileSize;
          break;
        case 'LEFT':
          nextX -= this.tileSize;
          break;
        case 'UP':
          nextY -= this.tileSize;
          break;
        case 'DOWN':
          nextY += this.tileSize;
          break;
      }

      // 3. Verificación de Bordes (Game Over)
      if (
        nextX < 0 ||
        nextX >= this.width ||
        nextY < 0 ||
        nextY >= this.height
      ) {
        this.crash();
        return;
      }

      // 4. Verificación de Choque con Cuerpo
      // Comparamos el futuro destino de la cabeza con los Targets actuales del cuerpo
      for (let i = 0; i < this.body.length - 1; i++) {
        if (nextX === this.body[i].tx && nextY === this.body[i].ty) {
          this.crash();
          return;
        }
      }

      // 5. Mover el cuerpo (Algoritmo Shift)
      // Actualizamos Previous (px) y Target (tx)
      for (let i = this.body.length - 1; i > 0; i--) {
        // "Guarda donde estabas" (Para interpolar desde ahí)
        this.body[i].px = this.body[i].tx;
        this.body[i].py = this.body[i].ty;

        // "Ve a donde va el de adelante"
        this.body[i].tx = this.body[i - 1].tx;
        this.body[i].ty = this.body[i - 1].ty;
      }

      // 6. Mover la Cabeza
      this.body[0].px = this.body[0].tx; // Guardar donde estaba
      this.body[0].py = this.body[0].ty;

      this.body[0].tx = nextX; // Asignar nuevo destino
      this.body[0].ty = nextY;
    }

    // ==========================================================
    // FASE 2: RENDER VISUAL (Se ejecuta SIEMPRE, 60fps)
    // ==========================================================

    // Calculamos el progreso entre el último movimiento y el siguiente
    // elapsed va de 0 a moveDelay (ej: de 0ms a 150ms)
    // Usamos el 'moveTime' que ya se actualizó arriba para saber cuánto falta
    let elapsed = time - (this.moveTime - this.moveDelay);
    let progress = elapsed / this.moveDelay;

    // Limitar progreso entre 0 y 1 para evitar glitches visuales
    if (progress > 1) progress = 1;
    if (progress < 0) progress = 0;

    // Interpolación Lineal: Mover suavemente de PX a TX
    this.body.forEach((segment) => {
      segment.x = Phaser.Math.Linear(segment.px, segment.tx, progress);
      segment.y = Phaser.Math.Linear(segment.py, segment.ty, progress);
    });
  }

  grows() {
    // Al crecer, creamos el segmento fuera de pantalla
    // En el siguiente update, la lógica del loop lo acomodará en la cola
    const newSegment = this.scene.physics.add
      .sprite(-100, -100, 'snakeTexture')
      .setOrigin(0);

    // Importante: Inicializar sus props para que no falle la interpolación
    newSegment.tx = -100;
    newSegment.ty = -100;
    newSegment.px = -100;
    newSegment.py = -100;

    this.body.push(newSegment);
  }
}
