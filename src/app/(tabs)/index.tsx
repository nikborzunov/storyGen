import BallComponent from '@/src/components/animation/ball';
import FairytaleButton from '@/src/components/buttons/FairytaleButton';
import ErrorView from '@/src/components/errors/errorView';
import LoaderView from '@/src/components/loaders/loaderView';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import TheStoryText from '@/src/components/TheStoryText';
import { useAppSelector } from '@/src/hooks/redux';
import { storyAPI } from '@/src/services/StoryServis';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Animated,
  Vibration,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type RootStackParamList = {
  HomeScreen: { titleOfStoryFromHistory: string };
};

const HomeScreen: React.FC = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [blinkAnim] = useState(new Animated.Value(1));
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [isBallMoving, setIsBallMoving] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [title, setTitle] = useState('');
  const [contentFromHistory, setContentFromHistory] = useState<string | undefined>('');
  const [fetching, setFetching] = useState(false);

  const route = useRoute<RouteProp<RootStackParamList, 'HomeScreen'>>();
  const titleOfStoryFromHistory = route.params?.titleOfStoryFromHistory;

  const selectedThemesFromStore = useAppSelector(state => state?.settings?.selectedThemes);
  const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
  const isDarkMode = toggleConfig['darkMode']?.checked;
  const isGameMode = toggleConfig['gameMode']?.checked;
  const isScreenBlocked = toggleConfig['blockScreen']?.checked;

  const library = useAppSelector(state => state?.story?.library);

  const themes: string[] = [];

  selectedThemesFromStore?.forEach((item) => {
    if (item?.checked) {
      themes.push(item?.name);
    }
  });

  const [fetchStories, { data: story, isLoading, error }] = storyAPI.useLazyFetchAllStoriesQuery();

  useEffect(() => {
    if (story?.data?.title?.length) {
      setTitle(story?.data?.title.replace(/^"|"$/g, ''));
      setFetching(false);
    };
  }, [isLoading, story])


  useEffect(() => {
    if (titleOfStoryFromHistory) {
      const storyFromHistory = library?.find((item) => item.title === titleOfStoryFromHistory);

      if (storyFromHistory) {
        setTitle(storyFromHistory.title);
        setContentFromHistory(storyFromHistory.content);
      }
    }
  }, [route?.params]);

  const animateTitleAndFetchData = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    animateTitleAndFetchData();
  }, []);

  const handleNewStoryRequest = async () => {
    if (isScreenBlocked) return;
    setFetching(true);
    setContentFromHistory(undefined);
    
    try {
      await fetchStories({themes: themes}).unwrap();
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  const handleBallMovement = ({ nativeEvent: { locationX, locationY } }: { nativeEvent: { locationX: number, locationY: number } }) => {
    if (!isGameMode) return; 
    Vibration.vibrate(500);
    setBallPosition({ x: locationX - 25, y: locationY - 25 });
    setIsBallMoving(true);
  };

  const handleLayout = ({ nativeEvent: { layout } }: { nativeEvent: { layout: { width: number, height: number } } }) => {
    setContainerDimensions({ width: layout.width, height: layout.height });
  };

  const styles = getStyles(isDarkMode);

  if (isLoading || fetching) {
    return <LoaderView/>;
  }

  if (error && !title) {
    return <ErrorView onRetry={handleNewStoryRequest} />;
  };

  return (
    <ThemedView
      style={styles.container}
      onStartShouldSetResponder={() => isGameMode}
      onResponderGrant={isGameMode ? handleBallMovement : () => {}}
      onLayout={handleLayout}
    >
      {(isBallMoving && isGameMode) && <BallComponent startPosition={ballPosition} containerDimensions={containerDimensions} />}
      {!title ? 
        <Animated.View style={styles.emptyTitleContainer}>
          <ThemedText style={styles.emptyTitle}>{'Хочешь сказку?'}</ThemedText>
        </Animated.View>
      :
        <Animated.View style={styles.titleContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
        </Animated.View>
      }
      {title ? 
      <ScrollView contentContainerStyle={styles.storyContainer}>
        <TheStoryText contentFromHistory={contentFromHistory} disabledButtons={isScreenBlocked}/>
      </ScrollView>
    :
      <LottieView
        source={require('../../assets/lottie/book_switch_pages.json')}
        autoPlay
        loop
        style={styles.loaderAnimation}
      />
      }
      {title ?
        <FairytaleButton onPress={handleNewStoryRequest} disabled={isLoading || fetching} blocked={isScreenBlocked} />
        :
        <FairytaleButton customText={'Хочу'}  onPress={handleNewStoryRequest} disabled={isLoading || fetching} blocked={isScreenBlocked} />
      }
    </ThemedView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyTitleContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFD700' : '#DAA520',
    textAlign: 'center',
    lineHeight: 40,
    fontFamily: 'VezitsaCyrillic',
  },
  emptyTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFD700' : '#DAA520',
    textAlign: 'center',
    lineHeight: 50,
    fontFamily: 'VezitsaCyrillic',
  },
  storyContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
    elevation: 5,
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  loaderAnimation: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;