import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import AnimatedBasketball from './AnimatedBasketball';

const BALL_SIZE = 50;
const DECAY_FACTOR = 0.995;

interface BallComponentProps {
  startPosition: { x: number; y: number };
  containerDimensions: { width: number; height: number };
}

const BallComponent: React.FC<BallComponentProps> = ({ startPosition, containerDimensions }) => {
  const velocity = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isAnimating = useRef(false);
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number }>(startPosition);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const angle = Math.random() * 2 * Math.PI;
    velocity.current = {
      x: Math.cos(angle) * 15,
      y: Math.sin(angle) * 15,
    };
    setBallPosition(startPosition);
    setIsMoving(true);

    if (!isAnimating.current) {
      isAnimating.current = true;
      requestAnimationFrame(moveBall);
    }

    return () => {
      isAnimating.current = false;
    };
  }, [startPosition]);

  const moveBall = useCallback(() => {
    setBallPosition((prev) => {
      let newX = prev.x + velocity.current.x;
      let newY = prev.y + velocity.current.y;

      if (newX <= 0 || newX >= containerDimensions.width - BALL_SIZE) {
        newX = Math.max(0, Math.min(newX, containerDimensions.width - BALL_SIZE));
        velocity.current.x = -velocity.current.x * DECAY_FACTOR;
      }

      if (newY <= 0 || newY >= containerDimensions.height - BALL_SIZE) {
        newY = Math.max(0, Math.min(newY, containerDimensions.height - BALL_SIZE));
        velocity.current.y = -velocity.current.y * DECAY_FACTOR;
      }

      velocity.current.x = Math.abs(velocity.current.x) < 0.1 ? 0 : velocity.current.x * DECAY_FACTOR;
      velocity.current.y = Math.abs(velocity.current.y) < 0.1 ? 0 : velocity.current.y * DECAY_FACTOR;

      const isBallStillMoving = Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.y) > 0.1;

      if (isBallStillMoving) {
        return { x: newX, y: newY };
      } else {
        isAnimating.current = false;
        setIsMoving(false);
        return prev;
      }
    });

    if (isAnimating.current) {
      requestAnimationFrame(moveBall);
    }
  }, [containerDimensions.width, containerDimensions.height]);

  return (
    <View style={[styles.ball, { left: ballPosition.x, top: ballPosition.y }]}>
      <AnimatedBasketball startX={0} startY={0} endX={0} endY={0} isMoving={isMoving} />
    </View>
  );
};

const styles = StyleSheet.create({
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    zIndex: 1000,
  },
});

export default BallComponent;