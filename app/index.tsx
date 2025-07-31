import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  isActive: boolean;
  type: 'player' | 'obstacle' | 'collectible';
}

interface GameState {
  score: number;
  distance: number;
  gameSpeed: number;
  isGameOver: boolean;
  isPaused: boolean;
  highScore: number;
  coins: number;
}

class GameEngine {
  private gameObjects: GameObject[] = [];
  private gameState: GameState;
  private screenWidth: number;
  private screenHeight: number;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private onUpdate: (objects: GameObject[], state: GameState) => void;

  constructor(onUpdate: (objects: GameObject[], state: GameState) => void) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.onUpdate = onUpdate;
    
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

  private initializeGameObjects(): void {
    // Create player character
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

    // Generate initial obstacles and collectibles
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

    // Notify React component of updates
    this.onUpdate([...this.gameObjects], { ...this.gameState });

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

    // Increase game speed over time for progressive difficulty
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
    // Generate different types of obstacles
    const obstacleTypes = [
      { width: 40, height: 40, color: '#8B4513' }, // Wooden crate
      { width: 50, height: 30, color: '#696969' }, // Stone block
      { width: 35, height: 45, color: '#8B7355' }, // Bone pile
    ];
    
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    
    this.gameObjects.push({
      id: `obstacle_${Date.now()}_${Math.random()}`,
      x: this.screenWidth + Math.random() * 200,
      y: this.screenHeight - 200 - (Math.random() * 100),
      width: type.width,
      height: type.height,
      velocityX: 0,
      velocityY: 0,
      isActive: true,
      type: 'obstacle',
    });
  }

  private generateCollectibles(): void {
    // Generate different types of collectibles
    const collectibleTypes = [
      { width: 25, height: 25, color: '#FFD700' }, // Gold coin
      { width: 30, height: 30, color: '#FF69B4' }, // Gem
      { width: 40, height: 35, color: '#CD853F' }, // Treasure chest
    ];
    
    const type = collectibleTypes[Math.floor(Math.random() * collectibleTypes.length)];
    
    this.gameObjects.push({
      id: `collectible_${Date.now()}_${Math.random()}`,
      x: this.screenWidth + Math.random() * 300,
      y: this.screenHeight - 200 - (Math.random() * 150),
      width: type.width,
      height: type.height,
      velocityX: 0,
      velocityY: 0,
      isActive: true,
      type: 'collectible',
    });
  }
}

export default function DungeonRunner() {
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    distance: 0,
    gameSpeed: 300,
    isGameOver: false,
    isPaused: false,
    highScore: 0,
    coins: 0,
  });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const gameEngineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    const handleUpdate = (objects: GameObject[], state: GameState) => {
      setGameObjects(objects);
      setGameState(state);
    };

    gameEngineRef.current = new GameEngine(handleUpdate);

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.stop();
      }
    };
  }, []);

  const startGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.start();
      setIsGameStarted(true);
    }
  };

  const pauseGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.pause();
    }
  };

  const resumeGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.resume();
    }
  };

  const restartGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.reset();
      gameEngineRef.current.start();
      setIsGameStarted(true);
    }
  };

  const handleJump = () => {
    if (gameEngineRef.current && !gameState.isGameOver) {
      gameEngineRef.current.jump();
    }
  };

  const renderGameObject = (obj: GameObject) => {
    const style = {
      position: 'absolute' as const,
      left: obj.x,
      top: obj.y,
      width: obj.width,
      height: obj.height,
    };

    switch (obj.type) {
      case 'player':
        return (
          <View
            key={obj.id}
            style={[style, styles.player, { backgroundColor: '#4A90E2' }]}
          >
            {/* Knight helmet detail */}
            <View style={styles.helmet} />
            <View style={styles.visor} />
          </View>
        );
      case 'obstacle':
        return (
          <View
            key={obj.id}
            style={[style, styles.obstacle, { backgroundColor: '#8B4513' }]}
          >
            {/* Wooden crate details */}
            <View style={styles.crateDetail1} />
            <View style={styles.crateDetail2} />
          </View>
        );
      case 'collectible':
        return (
          <View
            key={obj.id}
            style={[style, styles.collectible, { backgroundColor: '#FFD700' }]}
          >
            {/* Coin shine effect */}
            <View style={styles.coinShine} />
          </View>
        );
      default:
        return null;
    }
  };

  if (!isGameStarted) {
    return (
      <LinearGradient
        colors={['#2C3E50', '#34495E', '#2C3E50']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.menuContainer}>
          <Text style={styles.title}>Dungeon Runner</Text>
          <Text style={styles.subtitle}>Medieval Endless Adventure</Text>
          
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Adventure</Text>
          </TouchableOpacity>
          
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>⚔️ Tap to jump</Text>
            <Text style={styles.instructionText}>🛡️ Avoid obstacles</Text>
            <Text style={styles.instructionText}>💰 Collect treasure</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (gameState.isGameOver) {
    return (
      <LinearGradient
        colors={['#2C3E50', '#34495E', '#2C3E50']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>⚔️ Game Over ⚔️</Text>
          <Text style={styles.scoreText}>Score: {gameState.score}</Text>
          <Text style={styles.coinsText}>Coins: {gameState.coins}</Text>
          <Text style={styles.highScoreText}>High Score: {gameState.highScore}</Text>
          
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Game UI */}
      <View style={styles.uiContainer}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {gameState.score}</Text>
          <Text style={styles.coinsText}>💰 {gameState.coins}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={gameState.isPaused ? resumeGame : pauseGame}
        >
          <Ionicons
            name={gameState.isPaused ? 'play' : 'pause'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Game World */}
      <TouchableOpacity
        style={styles.gameArea}
        activeOpacity={1}
        onPress={handleJump}
      >
        {/* Background with stone texture */}
        <View style={styles.background} />
        
        {/* Stone wall details */}
        <View style={styles.wallDetail1} />
        <View style={styles.wallDetail2} />
        
        {/* Ground platform */}
        <View style={styles.ground} />
        
        {/* Game Objects */}
        {gameObjects.map(renderGameObject)}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#ECF0F1',
    textAlign: 'center',
    marginBottom: 50,
  },
  startButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructions: {
    alignItems: 'center',
  },
  instructionText: {
    color: '#BDC3C7',
    fontSize: 16,
    marginBottom: 5,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  uiContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  scoreContainer: {
    flex: 1,
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  coinsText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  highScoreText: {
    color: '#3498DB',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pauseButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#34495E',
  },
  wallDetail1: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 100,
    height: 2,
    backgroundColor: '#2C3E50',
  },
  wallDetail2: {
    position: 'absolute',
    top: 150,
    right: 50,
    width: 80,
    height: 2,
    backgroundColor: '#2C3E50',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#7F8C8D',
    borderTopWidth: 2,
    borderTopColor: '#95A5A6',
  },
  player: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#2C3E50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helmet: {
    width: 20,
    height: 15,
    backgroundColor: '#2C3E50',
    borderRadius: 10,
    position: 'absolute',
    top: 5,
  },
  visor: {
    width: 12,
    height: 2,
    backgroundColor: '#000',
    position: 'absolute',
    top: 12,
  },
  obstacle: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#654321',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  crateDetail1: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    height: 1,
    backgroundColor: '#654321',
  },
  crateDetail2: {
    position: 'absolute',
    top: 15,
    left: 5,
    right: 5,
    height: 1,
    backgroundColor: '#654321',
  },
  collectible: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#B8860B',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinShine: {
    width: 8,
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
    position: 'absolute',
    top: 3,
    left: 3,
  },
});