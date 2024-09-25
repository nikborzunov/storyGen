import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';
import { useAppSelector } from '@/src/hooks/redux';
import { selectTypingModeAndDarkMode } from '../store/selectors/selectors';

function processNewLines(text: string): string {
  return text.replace(/\\n/g, '\n').replace(/'/g, '  ');
};

const MemoizedText = React.memo(({ text, styles }: { text: string, styles: any }) => {
  return <ThemedText style={styles.storyText}>{text}</ThemedText>;
});

const TheStoryText: React.FC<{ contentFromHistory: string | undefined, disabledButtons?: boolean }> = ({
  contentFromHistory,
  disabledButtons,
}) => {
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [isUserPaused, setIsUserPaused] = useState<boolean>(false);
  
  const displayedTextRef = useRef<string>('');  
  const [, forceUpdate] = useState(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isTypingMode, isDarkMode } = useAppSelector(selectTypingModeAndDarkMode);

  const isAudioPlaying = useAppSelector(state => state.story.isAudioPlaying);
  const typingSpeed = 50;

  useEffect(() => {
    displayedTextRef.current = '';
    setCurrentCharIndex(0);
    setIsUserPaused(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    forceUpdate(n => n + 1);
  }, [contentFromHistory]);

  useEffect(() => {
    if (!contentFromHistory || !isTypingMode) {
      const processedText = processNewLines(contentFromHistory ?? '');
      displayedTextRef.current = processedText;
      setCurrentCharIndex(contentFromHistory?.length ?? 0);
      forceUpdate(n => n + 1);
      return;
    };

    if (!isAudioPlaying || isUserPaused || currentCharIndex >= contentFromHistory.length) {
      return;
    };

    typingTimeoutRef.current = setTimeout(() => {
      const nextChar = contentFromHistory[currentCharIndex];
      const isNewLine = nextChar === '\\' && contentFromHistory[currentCharIndex + 1] === 'n';
      const isParagraph = nextChar === '\'';
      
      const newText = isNewLine
        ? displayedTextRef.current + '\n'
        : isParagraph
          ? displayedTextRef.current + '  '
          : displayedTextRef.current + nextChar;

      displayedTextRef.current = newText;
      setCurrentCharIndex(currentCharIndex + (isNewLine ? 2 : 1));
      forceUpdate(n => n + 1);
    }, typingSpeed);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTypingMode, isAudioPlaying, isUserPaused, currentCharIndex, contentFromHistory]);

  const toggleUserPause = useCallback(() => {
    if (isAudioPlaying) {
      setIsUserPaused(prevState => !prevState);
    }
  }, [isAudioPlaying]);

  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

  return (
    <TouchableWithoutFeedback onPress={toggleUserPause}>
      <View style={styles.storyTextContainer}>
        <MemoizedText styles={styles} text={displayedTextRef.current} />
        {!disabledButtons && isTypingMode && contentFromHistory && currentCharIndex < contentFromHistory.length ? (
          <ThemedText style={isUserPaused ? styles.resumeText : styles.pauseText}>
            {isUserPaused ? 'Нажмите, чтобы продолжить' : 'Нажмите, чтобы приостановить'}
          </ThemedText>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

const getStyles = (isDarkMode: boolean) => ({
  storyTextContainer: {
    padding: 15,
    backgroundColor: isDarkMode ? '#f5e8c6' : '#FAF3E0',
    borderColor: '#D0B490',
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B3933',
    fontFamily: 'Courier',
  },
  pauseText: {
    fontSize: 16,
    color: '#D2691E',
    textAlign: 'center' as const,
    marginTop: 10,
  },
  resumeText: {
    fontSize: 16,
    color: '#8FBC8F',
    textAlign: 'center' as const,
    marginTop: 10,
  },
});

const MemoizedTheStoryText = React.memo(TheStoryText, (prevProps, nextProps) => {
  return (
    prevProps.contentFromHistory === nextProps.contentFromHistory &&
    prevProps.disabledButtons === nextProps.disabledButtons
  );
});

export default MemoizedTheStoryText;