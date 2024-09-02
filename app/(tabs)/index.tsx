import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  Animated,
  Vibration,
  ActivityIndicator,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native'; // Импортируйте LottieView
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import BallComponent from '@/components/animation/ball';
import TheStoryText from '@/components/TheStoryText';
import FairytaleButton from '@/components/buttons/FairytaleButton';
import { logger } from '@/helpers/logger';

interface StoryData {
  title: string;
  content: string;
}

const API_URL = 'http://192.168.0.103:1001/story/create';

const HomeScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [isBallMoving, setIsBallMoving] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fairytaleText, setFairytaleText] = useState('');
  const [title, setTitle] = useState('');
  const [canRequestNewStory, setCanRequestNewStory] = useState(true);

  const animateTitleAndFetchData = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start();

    fetchData();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    animateTitleAndFetchData();
  }, [animateTitleAndFetchData]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCanRequestNewStory(false);
  
    logger.info('Запрос к API для получения сказки');
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeOfStory: 'Два лисенка' }),
      });
  
      if (!response.ok) {
        logger.error('Сетевой ответ не был успешным: ', response);
        throw new Error('Сетевой ответ не был успешным');
      }
  
      const responseData = await response.json();
      const data: StoryData = parseStoryData(responseData);
  
      setTitle(data.title);
      setFairytaleText(data.content);
      logger.log('Полученные данные:', { title: data.title, content: data.content });
  
      setTimeout(() => {
        setCanRequestNewStory(true);
      }, 5000);
    } catch (error: unknown) {
      logger.error('Ошибка во время получения данных: ', error);
      const errorMessage = (error instanceof Error) ? error.message : 'Неизвестная ошибка';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const parseStoryData = (data: any): StoryData => {
    if (!data?.data) {
      throw new Error('Нет поля data в ответе');
    }
  
    const { title, content } = data.data;

    if (title === undefined || content === undefined) {
      throw new Error('Полученные данные не содержат title или content');
    }
  
    return { 
      title: title.replace(/"/g, ''),
      content: content || '' 
    };
  };

  const handleNewStoryRequest = useCallback(() => {
    if (canRequestNewStory) {
      fetchData();
    }
  }, [fetchData, canRequestNewStory]);

  const handleBallMovement = ({ nativeEvent: { locationX, locationY } }: any) => {
    Vibration.vibrate(500);
    setBallPosition({ x: locationX - 25, y: locationY - 25 });
    setIsBallMoving(true);
  };

  const handleLayout = ({ nativeEvent: { layout } }: any) => {
    setContainerDimensions({ width: layout.width, height: layout.height });
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          source={require('../../assets/lottie/flower.json')} // Укажите путь к вашему файлу анимации
          autoPlay
          loop
          style={styles.loaderAnimation}
        />
      </View>
    );
  }

  if (!!error && !title && !fairytaleText) {
    return (
      <View style={styles.loaderContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <FairytaleButton onPress={handleNewStoryRequest} disabled={!canRequestNewStory} />
      </View>
    );
  }

  return (
    <ThemedView
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onResponderGrant={handleBallMovement}
      onLayout={handleLayout}
    >
      {isBallMoving && <BallComponent startPosition={ballPosition} containerDimensions={containerDimensions} />}
      <Animated.View style={[styles.titleContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <ThemedText style={styles.title}>{title}</ThemedText>
      </Animated.View>
      <ScrollView contentContainerStyle={styles.storyContainer}>
        <TheStoryText fairytaleText={fairytaleText} />
      </ScrollView>
      <FairytaleButton onPress={handleNewStoryRequest} disabled={!canRequestNewStory} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f5f5f5',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#DAA520',
    textAlign: 'center',
    lineHeight: 60,
    fontFamily: 'lombardina-initial-two',
  },
  storyContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff', // Белый фон
  },
  loaderAnimation: {
    width: 200, // Задайте ширину анимации
    height: 200, // Задайте высоту анимации
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default HomeScreen;