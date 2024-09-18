import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';
import { useAppSelector } from '@/src/hooks/redux';

function processNewLines(text: string): string {
  return text.replace(/\\n/g, '\n').replace(/'/g, '  ');
};

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
      const processedText = processNewLines(contentFromHistory || '');
      setDisplayedText(processedText);
      setCurrentCharIndex(contentFromHistory?.length || 0);
      return;
    }
  
    if (!contentFromHistory || isPaused) return;
  
    const timer = currentCharIndex < contentFromHistory.length ?
      setTimeout(() => {
        const nextChar = contentFromHistory[currentCharIndex];
        const isSpecialSequence = nextChar === '\\' && contentFromHistory[currentCharIndex + 1] === 'n';
        const isParagraph = nextChar === '\'';
        if (isSpecialSequence) {
          setDisplayedText(prevText => `${prevText}\n`);
          setCurrentCharIndex(currentCharIndex + 2);
        } else if (isParagraph) {
          setDisplayedText(prevText => `${prevText}  `);
          setCurrentCharIndex(currentCharIndex + 1);
        } else {
          setDisplayedText(prevText => prevText + nextChar);
          setCurrentCharIndex(prevIndex => prevIndex + 1);
        }
      }, typingSpeed) : null;
  
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
        {!disabledButtons && isTypingMode && contentFromHistory && currentCharIndex < contentFromHistory?.length ? (
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
    backgroundColor: '#FAF3E0', // Бежевый фон, продолжающий стилистику бумаги
    borderColor: '#D0B490', // Более насыщенный контур для текста
    borderWidth: 1,
    borderRadius: 8,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B3933', // Более спокойный, теплый цвет текста
    fontFamily: 'Courier', // Машинописный шрифт для выделения "печатаемого" текста
    textAlign: 'justify',
  },
  pauseText: {
    fontSize: 16,
    color: '#D2691E', // Цвет "пауз" выделим мягким коричневым
    textAlign: 'center',
    marginTop: 10,
  },
  resumeText: {
    fontSize: 16,
    color: '#8FBC8F', // Зеленый для продолжения в позитивной интонации
    textAlign: 'center',
    marginTop: 10,
  },
});

const MemoizedTheStoryText = React.memo(TheStoryText);
export default MemoizedTheStoryText;