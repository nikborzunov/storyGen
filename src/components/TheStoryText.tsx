import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';
import { useAppSelector } from '@/src/hooks/redux';

const TheStoryText: React.FC<{ contentFromHistory: string | undefined, disabledButtons?: boolean }> = ({ contentFromHistory, disabledButtons }) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
  const isTypingMode = toggleConfig['typingEffect']?.checked;
  const isDarkMode = toggleConfig['darkMode']?.checked;

  const library = useAppSelector(state => state?.story?.library);
  const lastStoryIndex = library?.length - 1;
  const fairytaleText = useRef(library?.[lastStoryIndex]?.content);

  useEffect(() => {
    if (contentFromHistory?.length) {
      setIsPaused(true);
    };
  }, [contentFromHistory?.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (contentFromHistory?.length) {
      if (fairytaleText?.current !== contentFromHistory) {
        fairytaleText.current = contentFromHistory;
        setCurrentIndex(contentFromHistory.length);
      };

      setDisplayedText(contentFromHistory);
    };

    if ((isTypingMode && !disabledButtons) && fairytaleText?.current?.length && currentIndex < fairytaleText?.current?.length && !isPaused) {
      interval = setInterval(() => {
        setDisplayedText(prev => prev + fairytaleText.current[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 100);

    } else {
      setDisplayedText(fairytaleText.current);
      setCurrentIndex(fairytaleText.current.length);
    };

    if (currentIndex >= fairytaleText.current.length) {
      setIsPaused(true);
    };

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fairytaleText, currentIndex, isPaused, contentFromHistory?.length, isTypingMode]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const styles = getStyles(isDarkMode);

  return (
    <TouchableWithoutFeedback onPress={togglePause}>
      <View style={styles.storyTextContainer}>
        <ThemedText style={styles.storyText}>{displayedText}</ThemedText>
        {isTypingMode && !disabledButtons && !contentFromHistory?.length ? (
          <ThemedText style={isPaused ? styles.resumeText : styles.pauseText}>
            {isPaused ? 'Нажмите, чтобы продолжить' : 'Нажмите, чтобы приостановить'}
          </ThemedText>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  storyTextContainer: {
    padding: 15,
    backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
  },
  storyText: {
    fontSize: 18,
    lineHeight: 24,
    color: isDarkMode ? '#E0E0E0' : '#333',
    textAlign: 'justify',
    fontFamily: 'ofont.ru_Palatino-Normal',
  },
  pauseText: {
    fontSize: 16,
    color: isDarkMode ? '#FFA07A' : '#FF4500',
    textAlign: 'center',
    marginTop: 10,
  },
  resumeText: {
    fontSize: 16,
    color: isDarkMode ? '#44944A' : '#228B22',
    textAlign: 'center',
    marginTop: 10,
  },
});

const MemoizedTheStoryText = React.memo(TheStoryText);
export default MemoizedTheStoryText;