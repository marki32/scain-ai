import { Dimensions } from 'react-native';

export interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  isActive: boolean;
  type: 'player' | 'obstacle' | 'collectible' | 'background';
}

export interface GameState {
  score: number;
  distance: number;
  gameSpeed: number;
  isGameOver: boolean;
  isPaused: boolean;
  highScore: number;
  coins: number;
}

export class GameEngine {
  private gameObjects: GameObject[] = [];
  private gameState: GameState;
  private screenWidth: number;
  private screenHeight: number;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;

  constructor() {
    const { width, height } = Dimensions.get('window');
    this.screenWidth = width;
    this.screenHeight = height;
    
    this.gameState = {
      score: 0,
      distance: 0,
      gameSpeed: 300,
      isGameOver: false,
      isPaused: false,
      highScore: 0,
      coins: 0,
    };
  }

  public start(): void {
    this.reset();
    this.gameLoop();
  }

  public pause(): void {
    this.gameState.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  public resume(): void {
    this.gameState.isPaused = false;
    this.gameLoop();
  }

  public stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.gameState.isGameOver = true;
  }

  public reset(): void {
    this.gameObjects = [];
    this.gameState = {
      score: 0,
      distance: 0,
      gameSpeed: 300,
      isGameOver: false,
      isPaused: false,
      highScore: Math.max(this.gameState.highScore, this.gameState.score),
      coins: 0,
    };
    this.initializeGameObjects();
  }

  public jump(): void {
    const player = this.gameObjects.find(obj => obj.type === 'player');
    if (player && player.y >= this.screenHeight - 200) {
      player.velocityY = -800;
    }
  }

  public getGameObjects(): GameObject[] {
    return this.gameObjects;
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  private initializeGameObjects(): void {
    // Create player
    this.gameObjects.push({
      id: 'player',
      x: 100,
      y: this.screenHeight - 200,
      width: 50,
      height: 50,
      velocityX: 0,
      velocityY: 0,
      isActive: true,
      type: 'player',
    });

    // Create initial obstacles and collectibles
    this.generateObstacles();
    this.generateCollectibles();
  }

  private gameLoop = (currentTime: number = 0): void => {
    if (this.gameState.isPaused || this.gameState.isGameOver) {
      return;
    }

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.checkCollisions();
    this.cleanupObjects();

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number): void {
    const timeScale = deltaTime / 16.67; // 60 FPS baseline

    this.gameObjects.forEach(obj => {
      if (!obj.isActive) return;

      // Apply gravity to player
      if (obj.type === 'player') {
        obj.velocityY += 2000 * timeScale; // Gravity
        obj.y += obj.velocityY * timeScale;
        
        // Ground collision
        if (obj.y >= this.screenHeight - 200) {
          obj.y = this.screenHeight - 200;
          obj.velocityY = 0;
        }
      }

      // Move obstacles and collectibles
      if (obj.type === 'obstacle' || obj.type === 'collectible') {
        obj.x -= this.gameState.gameSpeed * timeScale;
      }

      // Deactivate objects that are off screen
      if (obj.x + obj.width < 0) {
        obj.isActive = false;
      }
    });

    // Update game state
    this.gameState.distance += this.gameState.gameSpeed * timeScale;
    this.gameState.score = Math.floor(this.gameState.distance / 100);

    // Increase game speed over time
    this.gameState.gameSpeed += 0.5 * timeScale;

    // Generate new objects
    if (Math.random() < 0.02 * timeScale) {
      this.generateObstacles();
    }
    if (Math.random() < 0.01 * timeScale) {
      this.generateCollectibles();
    }
  }

  private checkCollisions(): void {
    const player = this.gameObjects.find(obj => obj.type === 'player');
    if (!player) return;

    this.gameObjects.forEach(obj => {
      if (!obj.isActive || obj.type === 'player') return;

      if (this.isColliding(player, obj)) {
        if (obj.type === 'obstacle') {
          this.gameState.isGameOver = true;
        } else if (obj.type === 'collectible') {
          obj.isActive = false;
          this.gameState.coins++;
          this.gameState.score += 10;
        }
      }
    });
  }

  private isColliding(obj1: GameObject, obj2: GameObject): boolean {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }

  private cleanupObjects(): void {
    this.gameObjects = this.gameObjects.filter(obj => obj.isActive);
  }

  private generateObstacles(): void {
    const types = ['crate', 'bone', 'stone'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    this.gameObjects.push({
      id: `obstacle_${Date.now()}_${Math.random()}`,
      x: this.screenWidth + Math.random() * 200,
      y: this.screenHeight - 200 - (Math.random() * 100),
      width: 40 + Math.random() * 30,
      height: 40 + Math.random() * 30,
      velocityX: 0,
      velocityY: 0,
      isActive: true,
      type: 'obstacle',
    });
  }

  private generateCollectibles(): void {
    const types = ['coin', 'gem', 'chest'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    this.gameObjects.push({
      id: `collectible_${Date.now()}_${Math.random()}`,
      x: this.screenWidth + Math.random() * 300,
      y: this.screenHeight - 200 - (Math.random() * 150),
      width: 30,
      height: 30,
      velocityX: 0,
      velocityY: 0,
      isActive: true,
      type: 'collectible',
    });
  }
}