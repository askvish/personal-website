import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  HostListener,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameService } from './game.service';
import { GameState } from './game-objects.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pong-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pong-game.component.html',
  styleUrls: ['./pong-game.component.scss'],
})
export default class PongGameComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('gameCanvas', { static: true })
  gameCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private readonly destroyed$ = new Subject<void>();

  gameState!: GameState;
  isPlaying = false;
  difficulties = ['easy', 'medium', 'hard'];
  selectedDifficulty = 'medium';

  constructor(private readonly gameService: GameService) {}

  ngOnInit(): void {
    setTimeout(() => {
      window.addEventListener('keydown', this.preventScrollOnSpacebar, false);
      this.onResize();
    });
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.subscribeToGameState();

    // Resize handling
    this.onResize();
  }

  preventScrollOnSpacebar = (event: KeyboardEvent): void => {
    if (
      (event.code === 'ArrowUp' || event.code === 'ArrowDown') &&
      event.target === document.body
    ) {
      event.preventDefault();
    }
  };

  private initializeCanvas(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // Set up game with canvas dimensions
    this.gameService.initializeGame(canvas.width, canvas.height);
  }

  private subscribeToGameState(): void {
    this.gameService.gameState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((gameState) => {
        this.gameState = gameState;
        this.isPlaying = gameState.playing;
        this.selectedDifficulty = gameState.difficulty;
        this.drawGameState();
      });
  }

  @HostListener('window:resize')
  onResize(): void {
    const canvas = this.gameCanvas.nativeElement;
    const container = canvas.parentElement!;

    // Make canvas fill its container
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Update game dimensions
    this.gameService.initializeGame(canvas.width, canvas.height);
  }

  private drawGameState(): void {
    if (!this.ctx) return;

    const { width, height } = this.gameState.gameBoundary;

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);

    // Draw background with gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#192231');
    gradient.addColorStop(1, '#111927');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Add subtle grid pattern
    this.drawGrid();

    // Draw center line
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    this.ctx.lineWidth = 6;
    this.ctx.setLineDash([20, 15]);
    this.ctx.beginPath();
    this.ctx.moveTo(width / 2, 0);
    this.ctx.lineTo(width / 2, height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw scores
    this.drawScores();

    // Draw paddles with glow effect
    this.drawPaddles();

    // Draw ball with glow effect
    this.drawBall();

    // If game is not playing, show start message
    if (!this.isPlaying) {
      this.drawStartMessage();
    }
  }

  private drawGrid(): void {
    const { width, height } = this.gameState.gameBoundary;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    this.ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= width; x += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }
  }

  private drawScores(): void {
    const { width } = this.gameState.gameBoundary;

    // Draw player score (left)
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(33, 150, 243, 0.9)';
    this.ctx.font = 'bold 72px "Orbitron", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = '#2196f3';
    this.ctx.shadowBlur = 20;
    this.ctx.fillText(this.gameState.scores[0].toString(), width / 4, 80);
    this.ctx.restore();

    // Draw AI score (right)
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(244, 67, 54, 0.9)';
    this.ctx.font = 'bold 72px "Orbitron", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = '#f44336';
    this.ctx.shadowBlur = 20;
    this.ctx.fillText(this.gameState.scores[1].toString(), (width * 3) / 4, 80);
    this.ctx.restore();
  }

  private drawPaddles(): void {
    // Draw player paddle (left) with glow
    const playerPaddle = this.gameState.paddles[0];
    this.ctx.save();
    // Draw glow
    this.ctx.shadowColor = '#2196f3';
    this.ctx.shadowBlur = 15;
    // Draw paddle
    const playerGradient = this.ctx.createLinearGradient(
      playerPaddle.position.x,
      playerPaddle.position.y,
      playerPaddle.position.x + playerPaddle.dimensions.width,
      playerPaddle.position.y
    );
    playerGradient.addColorStop(0, '#2196f3');
    playerGradient.addColorStop(1, '#03a9f4');
    this.ctx.fillStyle = playerGradient;

    // Draw rounded rectangle for player paddle
    this.roundRect(
      playerPaddle.position.x,
      playerPaddle.position.y,
      playerPaddle.dimensions.width,
      playerPaddle.dimensions.height,
      6
    );
    this.ctx.fill();

    // Add highlight effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.roundRect(
      playerPaddle.position.x,
      playerPaddle.position.y,
      playerPaddle.dimensions.width * 0.7,
      playerPaddle.dimensions.height,
      6
    );
    this.ctx.fill();
    this.ctx.restore();

    // Draw AI paddle (right) with glow
    const aiPaddle = this.gameState.paddles[1];
    this.ctx.save();
    // Draw glow
    this.ctx.shadowColor = '#f44336';
    this.ctx.shadowBlur = 15;
    // Draw paddle
    const aiGradient = this.ctx.createLinearGradient(
      aiPaddle.position.x,
      aiPaddle.position.y,
      aiPaddle.position.x + aiPaddle.dimensions.width,
      aiPaddle.position.y
    );
    aiGradient.addColorStop(0, '#f44336');
    aiGradient.addColorStop(1, '#e53935');
    this.ctx.fillStyle = aiGradient;

    // Draw rounded rectangle for AI paddle
    this.roundRect(
      aiPaddle.position.x,
      aiPaddle.position.y,
      aiPaddle.dimensions.width,
      aiPaddle.dimensions.height,
      6
    );
    this.ctx.fill();

    // Add highlight effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.roundRect(
      aiPaddle.position.x + aiPaddle.dimensions.width * 0.3,
      aiPaddle.position.y,
      aiPaddle.dimensions.width * 0.7,
      aiPaddle.dimensions.height,
      6
    );
    this.ctx.fill();
    this.ctx.restore();
  }

  private drawBall(): void {
    const ball = this.gameState.ball;
    this.ctx.save();

    // Draw ball with glow effect
    this.ctx.shadowColor = '#ffffff';
    this.ctx.shadowBlur = 20;

    // Use gradient for ball
    const ballGradient = this.ctx.createRadialGradient(
      ball.position.x + ball.dimensions.width / 2,
      ball.position.y + ball.dimensions.height / 2,
      0,
      ball.position.x + ball.dimensions.width / 2,
      ball.position.y + ball.dimensions.height / 2,
      ball.dimensions.width / 2
    );
    ballGradient.addColorStop(0, '#ffffff');
    ballGradient.addColorStop(1, '#f0f0f0');

    this.ctx.fillStyle = ballGradient;
    this.ctx.beginPath();
    this.ctx.arc(
      ball.position.x + ball.dimensions.width / 2,
      ball.position.y + ball.dimensions.height / 2,
      ball.dimensions.width / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // Add highlight to ball
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.beginPath();
    this.ctx.arc(
      ball.position.x + ball.dimensions.width / 3,
      ball.position.y + ball.dimensions.height / 3,
      ball.dimensions.width / 6,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    this.ctx.restore();
  }

  private drawStartMessage(): void {
    const { width, height } = this.gameState.gameBoundary;
    this.ctx.save();

    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, width, height);

    // Draw container
    this.ctx.fillStyle = 'rgba(25, 34, 49, 0.9)';
    this.roundRect(width / 2 - 200, height / 2 - 70, 400, 140, 10);
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 24px "Orbitron", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Press SPACE to start', width / 2, height / 2);

    this.ctx.font = '16px "Orbitron", sans-serif';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.fillText(
      'Use ↑ and ↓ keys to move your paddle',
      width / 2,
      height / 2 + 40
    );

    this.ctx.restore();
  }

  // Helper for drawing rounded rectangles
  private roundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius,
      y + height
    );
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }

  startGame(): void {
    this.gameService.startGame();
  }

  toggleGame(): void {
    if (this.isPlaying) {
      this.gameService.pauseGame();
    } else {
      this.gameService.startGame();
    }
  }

  setDifficulty(difficulty: string): void {
    this.gameService.setDifficulty(difficulty);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      this.toggleGame();
      event.preventDefault();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.gameService.cleanup();

    window.removeEventListener('keydown', this.preventScrollOnSpacebar, false);
  }
}
