import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface TheStoryTextProps {
  fairytaleText: string; // Убедитесь, что пропс принимает строку
}

const TheStoryText: React.FC<TheStoryTextProps> = ({ fairytaleText }) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (fairytaleText && currentIndex < fairytaleText.length && !isPaused) {
      // Запускаем интервал только при наличии текста и когда не приостановлено
      interval = setInterval(() => {
        setDisplayedText(prev => prev + fairytaleText[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fairytaleText, currentIndex, isPaused]);

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  return (
    <TouchableWithoutFeedback onPress={togglePause}>
      <View style={styles.storyTextContainer}>
        <ThemedText style={styles.storyText}>{displayedText}</ThemedText>
        <ThemedText style={isPaused ? styles.resumeText : styles.pauseText}>
          {isPaused ? 'Нажмите, чтобы продолжить' : 'Нажмите, чтобы приостановить'}
        </ThemedText>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  storyTextContainer: {
    marginTop: 10,
    padding: 15,
  },
  storyText: {
    fontSize: 18,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
    fontFamily: 'ofont.ru_Palatino-Normal',
  },
  pauseText: {
    fontSize: 16,
    color: '#ffa07a',
    textAlign: 'center',
    marginTop: 10,
  },
  resumeText: {
    fontSize: 16,
    color: '#44944A',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default TheStoryText;