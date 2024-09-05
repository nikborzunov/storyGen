import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';
import { useAppSelector } from '@/src/hooks/redux';

const TheStoryText: React.FC<{ contentFromHistory: string | undefined }> = ({ contentFromHistory }) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const library = useAppSelector(state => state?.story?.library);
  const lastStoryIndex = library?.length - 1;
  const fairytaleText = useRef(library?.[lastStoryIndex]?.content);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (contentFromHistory?.length) {
      if (fairytaleText?.current !== contentFromHistory) {
        fairytaleText.current = contentFromHistory;
        setCurrentIndex(contentFromHistory?.length);
      };

      setDisplayedText(contentFromHistory);
    };

    if (fairytaleText?.current?.length && currentIndex < fairytaleText?.current?.length && !isPaused) {
      interval = setInterval(() => {
        setDisplayedText(prev => prev + fairytaleText?.current[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 100);

      if (currentIndex > fairytaleText?.current?.length) {
        setIsPaused(true);
      };
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fairytaleText, currentIndex, isPaused, contentFromHistory?.length]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, [currentIndex]);

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

const MemoizedTheStoryText = React.memo(TheStoryText);
export default MemoizedTheStoryText;