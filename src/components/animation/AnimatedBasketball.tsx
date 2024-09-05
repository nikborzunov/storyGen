import React, { useEffect, useRef, useState } from 'react';
import { View, Image, ViewStyle } from 'react-native';

interface AnimatedBasketballProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    isMoving: boolean;
    velocity: number;
}

const spriteWidth = 200; 
const spriteHeight = 140; 
const ballWidth = spriteWidth / 3; 
const ballHeight = spriteHeight / 2; 
const totalFrames = 6; 

const cubicEaseOut = (t: number) => t * t * (3 - 2 * t);

const AnimatedBasketball: React.FC<AnimatedBasketballProps> = ({ startX, startY, endX, endY, isMoving, velocity }) => {
    const [frame, setFrame] = useState(0);
    const [nextVelocity, setNextVelocity] = useState(velocity);
    const ref = useRef<View>(null);
    const animationRef = useRef<number | null>(null);
  
    useEffect(() => {
      if (isMoving) {
        setNextVelocity(velocity);
      }
    }, [velocity, isMoving]);

    const duration = Math.max(1000 / (nextVelocity + 1), 200);

    useEffect(() => {
      let startTime: number;

      const animateBall = (currentTime: number) => {
          if (!startTime) startTime = currentTime;
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const easedProgress = cubicEaseOut(progress);
  
          const currentX = startX + (endX - startX) * easedProgress;
          const currentY = startY + (endY - startY) * easedProgress;

          if (ref.current) {
              ref.current.setNativeProps({
                  style: {
                      transform: [{ translateX: currentX }, { translateY: currentY }],
                  },
              });
          }
  
          const newFrame = Math.floor((elapsedTime / duration) * totalFrames);
          setFrame(newFrame % totalFrames);
  
          if (elapsedTime < duration) {
              animationRef.current = requestAnimationFrame(animateBall);
          } else {
              startTime = currentTime; // Reset startTime for continuous animation
              setFrame(0); // Reset to the first frame for the next cycle
              animationRef.current = requestAnimationFrame(animateBall);
          }
      };
  
      if (isMoving) {
          animationRef.current = requestAnimationFrame(animateBall);
      }

      return () => {
          if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
          }
      };
    }, [startX, startY, endX, endY, isMoving, nextVelocity, duration]); 
  
    useEffect(() => {
        if (!isMoving) {
            setFrame(0);
        }
    }, [isMoving]);

    const frameStyle: ViewStyle = {
        width: ballWidth,
        height: ballHeight,
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor: 'transparent',
        overflow: 'hidden',
    };

    const columnFrame = frame % 3;
    const rowFrame = Math.floor(frame / 3);

    return (
        <View style={frameStyle} ref={ref}>
            <Image
                source={require('../../assets/sprites/basketball-ball-cropped.png')}
                style={{
                    width: spriteWidth,
                    height: spriteHeight,
                    position: 'absolute',
                    left: -columnFrame * ballWidth,
                    top: -rowFrame * ballHeight,
                }}
            />
        </View>
    );
};

export default AnimatedBasketball;