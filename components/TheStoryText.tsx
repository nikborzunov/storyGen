import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface StoryData {
  data: string;
}

export const TheStoryText: React.FC = () => {
  const [fairytaleText, setFairytaleText] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const URL = `http://192.168.0.103:1001/story/create`;

      try {
        const response = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            themeOfStory: 'Два лисенка',
          }),
        });

        if (!response.ok) {
          throw new Error('Сетевой ответ не был успешным');
        }

        const data: StoryData = await response.json();
        
        if (data && typeof data.data === 'string') {
          setFairytaleText(data.data);
        } else {
          throw new Error('Ожидалось поле "data" с текстом, но его нет или оно неверного типа');
        }
      } catch (error) {
        console.error('Ошибка при запросе:', (error as Error).message);
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (fairytaleText && currentIndex < fairytaleText.length) {
      interval = setInterval(() => {
        if (!isPaused) {
          setDisplayedText(prev => prev + fairytaleText[currentIndex]);
          setCurrentIndex(prevIndex => prevIndex + 1);
        }
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fairytaleText, isPaused, currentIndex]);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <ThemedText style={styles.errorText}>{error}</ThemedText>;
  }

  return (
    <TouchableWithoutFeedback onPress={() => setIsPaused(prev => !prev)}> 
      <View style={styles.storyTextContainer}>
        <ThemedText style={styles.storyText}>{displayedText}</ThemedText>
        <ThemedText style={isPaused ? styles.resumeText : styles.pauseText}>
          {isPaused ? 'Нажмите, чтобы продолжить' : 'Нажмите, чтобы приостановить'}
        </ThemedText>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  storyTextContainer: {
    marginTop: 10,
    padding: 15,
  },
  storyText: {
    fontSize: 18,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
    fontFamily: 'ofont.ru_Palatino-Normal'
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