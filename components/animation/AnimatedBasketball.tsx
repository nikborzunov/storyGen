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
    const ref = useRef<View>(null);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const duration = Math.max(1000 / (velocity + 1), 200);

    useEffect(() => {
        if (!isMoving) {
            setFrame(0);
            return;
        }

        const animateBall = (currentTime: number) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = currentTime;
            }
            
            const elapsedTime = currentTime - (startTimeRef.current || 0);
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
                startTimeRef.current = null; // Reset for the next cycle
                setFrame(0); // Reset to the first frame for the next cycle
                animationRef.current = requestAnimationFrame(animateBall); // Restart animation
            }
        };

        animationRef.current = requestAnimationFrame(animateBall);

        return () => {
            startTimeRef.current = null; // Clean up
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [startX, startY, endX, endY, isMoving, duration, velocity]);

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