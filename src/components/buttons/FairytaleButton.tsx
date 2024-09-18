import React, { useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FairytaleButtonProps {
  customText?: string;
  onPress: () => void;
  disabled?: boolean;
  blocked?: boolean;
}

const FairytaleButton: React.FC<FairytaleButtonProps> = ({ customText, onPress, disabled = false, blocked = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  let text;

  if (blocked) {
    text = 'Заблокировано';
  } else if (disabled) {
    text = 'Загрузка...';
  } else {
    text = customText || 'Новая Сказка';
  }

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
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <ThemedText
          style={[
            styles.buttonText,
            (disabled || blocked) && styles.buttonTextDisabled
          ]}
        >
          {text}
        </ThemedText>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF9F1C',
    borderRadius: 5,
    paddingVertical: 14,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
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