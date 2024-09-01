import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, ViewStyle } from 'react-native';

interface AnimatedBasketballProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    isMoving: boolean;
}

const spriteWidth = 200; 
const spriteHeight = 140; 
const ballWidth = spriteWidth / 3; 
const ballHeight = spriteHeight / 2; 
const totalFrames = 6; 

const AnimatedBasketball: React.FC<AnimatedBasketballProps> = ({ startX, startY, endX, endY, isMoving }) => {
    const [frame, setFrame] = useState(0);
    const ref = useRef<View>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const duration = 2000;
        let startTime = performance.now();

        const animateBall = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

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
                startTime = currentTime;
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
    }, [startX, startY, endX, endY, isMoving]);

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

    return (
        <View style={frameStyle} ref={ref}>
            <Image
                source={require('../../assets/sprites/basketball-ball.png')}
                style={{
                    width: spriteWidth,
                    height: spriteHeight,
                    position: 'absolute',
                    left: -(frame % 3) * ballWidth,
                    top: -Math.floor(frame / 3) * ballHeight,
                }}
            />
        </View>
    );
};

export default AnimatedBasketball;