import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function usePulseAnimation(
  animation: string | undefined,
  disabled: boolean,
  blocked: boolean
): Animated.Value {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation | null = null;

    if (animation === 'pulse' && !disabled && !blocked) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    }

    if ((disabled || blocked || animation !== 'pulse') && pulseAnimation) {
      pulseAnimation.stop();
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }

    return () => pulseAnimation?.stop();
  }, [scaleAnim, disabled, blocked, animation]);

  return scaleAnim;
}