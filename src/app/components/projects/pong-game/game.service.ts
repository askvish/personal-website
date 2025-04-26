import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameObject, GameState } from './game-objects.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly FRAME_RATE = 60;
  private readonly BALL_SPEED = 10;
  private readonly PADDLE_SPEED = 8;
  private readonly INITIAL_PADDLE_HEIGHT = 100;
  private readonly INITIAL_BALL_SIZE = 15;

  private readonly gameState: GameState = {
    ball: {
      position: { x: 0, y: 0 },
      dimensions: {
        width: this.INITIAL_BALL_SIZE,
        height: this.INITIAL_BALL_SIZE,
      },
      velocity: { x: 0, y: 0 },
      color: '#ffffff',
    },
    paddles: [
      {
        position: { x: 0, y: 0 },
        dimensions: { width: 15, height: this.INITIAL_PADDLE_HEIGHT },
        color: '#ffffff',
      },
      {
        position: { x: 0, y: 0 },
        dimensions: { width: 15, height: this.INITIAL_PADDLE_HEIGHT },
        color: '#ffffff',
      },
    ],
    scores: [0, 0],
    playing: false,
    gameBoundary: { width: 800, height: 600 },
    difficulty: 'medium', // Default difficulty
  };

  private gameLoop: any;
  private readonly keysPressed = new Set<string>();
  private aiReactionDelay = 16; // ms delay for AI reactions (medium difficulty)
  private aiPaddleSpeed = this.PADDLE_SPEED * 0.8; // Speed multiplier for AI paddle (medium)
  private aiLastMoveTime = 0;

  // Observables for game state and scores
  private readonly gameStateSubject = new BehaviorSubject<GameState>(this.gameState);
  gameState$ = this.gameStateSubject.asObservable();

  constructor() {
    this.setupKeyListeners();
  }

  initializeGame(canvasWidth: number, canvasHeight: number): void {
    this.gameState.gameBoundary = { width: canvasWidth, height: canvasHeight };

    // Reset paddles positions
    this.gameState.paddles[0].position = {
      x: 30,
      y: (canvasHeight - this.INITIAL_PADDLE_HEIGHT) / 2,
    };

    this.gameState.paddles[1].position = {
      x: canvasWidth - 30 - this.gameState.paddles[1].dimensions.width,
      y: (canvasHeight - this.INITIAL_PADDLE_HEIGHT) / 2,
    };

    this.resetBall();
    this.gameState.scores = [0, 0];

    this.gameStateSubject.next({ ...this.gameState });
  }

  setDifficulty(difficulty: string): void {
    this.gameState.difficulty = difficulty;

    // Adjust AI parameters based on difficulty
    switch (difficulty) {
      case 'easy':
        this.aiReactionDelay = 24;
        this.aiPaddleSpeed = this.PADDLE_SPEED * 0.6;
        break;
      case 'medium':
        this.aiReactionDelay = 16;
        this.aiPaddleSpeed = this.PADDLE_SPEED * 0.8;
        break;
      case 'hard':
        this.aiReactionDelay = 8;
        this.aiPaddleSpeed = this.PADDLE_SPEED * 1.0;
        break;
    }

    this.gameStateSubject.next({ ...this.gameState });
  }

  startGame(): void {
    if (!this.gameState.playing) {
      this.resetBall();
      this.gameState.playing = true;
      this.gameStateSubject.next({ ...this.gameState });

      this.gameLoop = setInterval(() => {
        this.updateGame();
      }, 1000 / this.FRAME_RATE);
    }
  }

  pauseGame(): void {
    if (this.gameState.playing) {
      this.gameState.playing = false;
      this.gameStateSubject.next({ ...this.gameState });
      clearInterval(this.gameLoop);
    }
  }

  resetBall(): void {
    const { width, height } = this.gameState.gameBoundary;

    this.gameState.ball.position = {
      x: width / 2 - this.INITIAL_BALL_SIZE / 2,
      y: height / 2 - this.INITIAL_BALL_SIZE / 2,
    };

    // Random direction for the ball
    const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
    const direction = Math.random() > 0.5 ? 1 : -1;

    this.gameState.ball.velocity = {
      x: direction * this.BALL_SPEED * Math.cos(angle),
      y: this.BALL_SPEED * Math.sin(angle),
    };
  }

  private updateGame(): void {
    this.moveBall();
    this.movePlayerPaddle();
    this.moveAIPaddle();
    this.checkCollisions();
    this.gameStateSubject.next({ ...this.gameState });
  }

  private moveBall(): void {
    if (!this.gameState.playing) return;

    const ball = this.gameState.ball;
    ball.position.x += ball.velocity!.x;
    ball.position.y += ball.velocity!.y;
  }

  private movePlayerPaddle(): void {
    // Player controls (Arrow Up, Arrow Down)
    if (this.keysPressed.has('ArrowUp')) {
      this.gameState.paddles[0].position.y -= this.PADDLE_SPEED;
    }
    if (this.keysPressed.has('ArrowDown')) {
      this.gameState.paddles[0].position.y += this.PADDLE_SPEED;
    }

    // Keep paddle within boundaries
    const paddle = this.gameState.paddles[0];
    if (paddle.position.y < 0) {
      paddle.position.y = 0;
    }
    if (
      paddle.position.y + paddle.dimensions.height >
      this.gameState.gameBoundary.height
    ) {
      paddle.position.y =
        this.gameState.gameBoundary.height - paddle.dimensions.height;
    }
  }

  private moveAIPaddle(): void {
    const now = Date.now();

    // Only update AI paddle at specific intervals (based on difficulty)
    if (now - this.aiLastMoveTime < this.aiReactionDelay) {
      return;
    }

    this.aiLastMoveTime = now;

    const ball = this.gameState.ball;
    const aiPaddle = this.gameState.paddles[1];
    const paddleCenter = aiPaddle.position.y + aiPaddle.dimensions.height / 2;
    const ballCenter = ball.position.y + ball.dimensions.height / 2;

    // Add some imperfection based on difficulty
    let targetY = ballCenter;

    // Only move if ball is moving toward AI paddle
    if (ball.velocity!.x > 0) {
      // Calculate where the ball will intersect with the AI paddle's x position
      const distanceToAI = aiPaddle.position.x - ball.position.x;
      const timeToReach = distanceToAI / ball.velocity!.x;
      const predictedY = ball.position.y + ball.velocity!.y * timeToReach;

      // Add randomness based on difficulty
      let errorMargin: number;
      switch (this.gameState.difficulty) {
        case 'easy':
          errorMargin = aiPaddle.dimensions.height * 0.3;
          break;
        case 'medium':
          errorMargin = aiPaddle.dimensions.height * 0.15;
          break;
        case 'hard':
          errorMargin = aiPaddle.dimensions.height * 0.05;
          break;
        default:
          errorMargin = 0;
      }

      // Add random error to prediction
      targetY = predictedY + (Math.random() * errorMargin * 2 - errorMargin);

      // Ensure target is within bounds
      targetY = Math.max(
        aiPaddle.dimensions.height / 2,
        Math.min(
          this.gameState.gameBoundary.height - aiPaddle.dimensions.height / 2,
          targetY
        )
      );
    }

    // Move AI paddle toward target
    const aiTargetCenter = targetY;

    if (paddleCenter < aiTargetCenter - 5) {
      aiPaddle.position.y += this.aiPaddleSpeed;
    } else if (paddleCenter > aiTargetCenter + 5) {
      aiPaddle.position.y -= this.aiPaddleSpeed;
    }

    // Keep AI paddle within boundaries
    if (aiPaddle.position.y < 0) {
      aiPaddle.position.y = 0;
    }
    if (
      aiPaddle.position.y + aiPaddle.dimensions.height >
      this.gameState.gameBoundary.height
    ) {
      aiPaddle.position.y =
        this.gameState.gameBoundary.height - aiPaddle.dimensions.height;
    }
  }

  private checkCollisions(): void {
    const ball = this.gameState.ball;
    const { width, height } = this.gameState.gameBoundary;

    // Top and bottom walls
    if (
      ball.position.y <= 0 ||
      ball.position.y + ball.dimensions.height >= height
    ) {
      ball.velocity!.y = -ball.velocity!.y;
      // Adjust position to prevent sticking
      if (ball.position.y <= 0) {
        ball.position.y = 0;
      } else {
        ball.position.y = height - ball.dimensions.height;
      }
    }

    // Check for paddle collisions
    this.gameState.paddles.forEach((paddle, index) => {
      if (this.isColliding(ball, paddle)) {
        const hitPos =
          ball.position.y +
          ball.dimensions.height / 2 -
          (paddle.position.y + paddle.dimensions.height / 2);
        const normalizedHitPos = hitPos / (paddle.dimensions.height / 2);

        // Change ball direction with some angle based on where it hit the paddle
        ball.velocity!.x = -ball.velocity!.x;
        ball.velocity!.y = this.BALL_SPEED * normalizedHitPos;

        // Slightly increase ball speed
        const speed = Math.sqrt(
          ball.velocity!.x * ball.velocity!.x +
            ball.velocity!.y * ball.velocity!.y
        );
        ball.velocity!.x = (ball.velocity!.x / speed) * (this.BALL_SPEED + 0.2);
        ball.velocity!.y = (ball.velocity!.y / speed) * (this.BALL_SPEED + 0.2);
      }
    });

    // Check if ball is out of bounds (scoring)
    if (ball.position.x < 0) {
      // AI scores (right paddle)
      this.gameState.scores[1]++;
      this.resetBall();
    } else if (ball.position.x + ball.dimensions.width > width) {
      // Player scores (left paddle)
      this.gameState.scores[0]++;
      this.resetBall();
    }
  }

  private isColliding(obj1: GameObject, obj2: GameObject): boolean {
    return (
      obj1.position.x < obj2.position.x + obj2.dimensions.width &&
      obj1.position.x + obj1.dimensions.width > obj2.position.x &&
      obj1.position.y < obj2.position.y + obj2.dimensions.height &&
      obj1.position.y + obj1.dimensions.height > obj2.position.y
    );
  }

  private setupKeyListeners(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      this.keysPressed.add(e.key);
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      this.keysPressed.delete(e.key);
    });
  }

  cleanup(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
  }
}
