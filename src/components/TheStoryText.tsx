import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';
import { useAppSelector } from '@/src/hooks/redux';

const TheStoryText: React.FC<{ contentFromHistory: string | undefined, disabledButtons?: boolean }> = ({ contentFromHistory, disabledButtons }) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
  const isTypingMode = toggleConfig['typingEffect']?.checked;
  const isDarkMode = toggleConfig['darkMode']?.checked;
  const typingSpeed = 5;

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  useEffect(() => {
    setDisplayedText('');
    setCurrentCharIndex(0);
    setIsPaused(false);
  }, [contentFromHistory]);
  
  useEffect(() => {
    if (!isTypingMode) {
      setDisplayedText(contentFromHistory || '');
      setCurrentCharIndex(contentFromHistory?.length || 0);
      return;
    }
  
    if (!contentFromHistory || isPaused) return;
  
    const timer = currentCharIndex < contentFromHistory.length ?
      setTimeout(() => {
        setDisplayedText(prevText => prevText + contentFromHistory[currentCharIndex]);
        setCurrentCharIndex(prevIndex => prevIndex + 1);
      }, typingSpeed) : null;

    if((!contentFromHistory || currentCharIndex >= contentFromHistory?.length -1)) {
      setIsPaused(true);
    };
  
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentCharIndex, isPaused, isTypingMode, contentFromHistory, typingSpeed]);

  const styles = getStyles(isDarkMode);

  return (
    <TouchableWithoutFeedback onPress={togglePause}>
      <View style={styles.storyTextContainer}>
        <ThemedText style={styles.storyText}>{displayedText}</ThemedText>
        {isTypingMode && (!disabledButtons && !(!contentFromHistory || currentCharIndex >= contentFromHistory?.length -1)) ? (
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
    textAlign: 'left',
    fontFamily: 'Ariel',
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