import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GameObject } from '../game/GameEngine';

interface GameRendererProps {
  gameObjects: GameObject[];
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const GameRenderer: React.FC<GameRendererProps> = ({ gameObjects }) => {
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
            style={[
              style,
              styles.player,
              { backgroundColor: '#4A90E2' },
            ]}
          />
        );
      case 'obstacle':
        return (
          <View
            key={obj.id}
            style={[
              style,
              styles.obstacle,
              { backgroundColor: '#8B4513' },
            ]}
          />
        );
      case 'collectible':
        return (
          <View
            key={obj.id}
            style={[
              style,
              styles.collectible,
              { backgroundColor: '#FFD700' },
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View style={styles.ground} />
      {gameObjects.map(renderGameObject)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#2C3E50',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#34495E',
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
  collectible: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#B8860B',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
});