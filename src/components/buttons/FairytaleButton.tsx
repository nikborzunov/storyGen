import React from 'react';
import { Animated, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';
import { usePulseAnimation } from '@/src/hooks/usePulseAnimation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FairytaleButtonProps {
  customText?: string;
  customWidth?: number;
  onPress: () => void;
  disabled?: boolean;
  blocked?: boolean;
  animation?: string;
}

const FairytaleButton: React.FC<FairytaleButtonProps> = ({
  customText,
  customWidth = 0,
  onPress,
  disabled = false,
  blocked = false,
  animation,
}) => {
  const scaleAnim = usePulseAnimation(animation, disabled, blocked);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const text = blocked
    ? 'Заблокировано'
    : disabled
    ? 'Загрузка...'
    : customText || 'Новая Сказка';

  const styles = getStyles(customWidth);

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={!(disabled || blocked) ? onPress : undefined}
      disabled={disabled || blocked}
      activeOpacity={0.85}
    >
      <Animated.View
        style={[
          styles.button,
          (disabled || blocked) && styles.buttonDisabled,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <ThemedText
          style={[
            styles.buttonText,
            (disabled || blocked) && styles.buttonTextDisabled,
          ]}
        >
          {text}
        </ThemedText>
      </Animated.View>
    </TouchableOpacity>
  );
};

const getStyles = (customWidth: number) =>
  StyleSheet.create({
    button: {
      backgroundColor: '#FF9F1C',
      borderRadius: 5,
      paddingVertical: 14,
      width: customWidth || SCREEN_WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    buttonText: {
      fontSize: 16,
      lineHeight: 18,
      fontWeight: '600',
      color: '#FFF',
    },
    buttonDisabled: {
      backgroundColor: '#BEBEBE',
    },
    buttonTextDisabled: {
      color: '#EAEAEA',
    },
  });

export default FairytaleButton;