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

const HomeScreen: React.FC = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [blinkAnim] = useState(new Animated.Value(1));
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [isBallMoving, setIsBallMoving] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [title, setTitle] = useState('');
  const [fetching, setFetching] = useState(false);

  const selectedThemesFromStore = useAppSelector(state => state?.settings?.selectedThemes);

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
  
    setFetching(true);
    
    try {
      await fetchStories(themes).unwrap();
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  const handleBallMovement = ({ nativeEvent: { locationX, locationY } }: { nativeEvent: { locationX: number, locationY: number } }) => {
    Vibration.vibrate(500);
    setBallPosition({ x: locationX - 25, y: locationY - 25 });
    setIsBallMoving(true);
  };

  const handleLayout = ({ nativeEvent: { layout } }: { nativeEvent: { layout: { width: number, height: number } } }) => {
    setContainerDimensions({ width: layout.width, height: layout.height });
  };

  if (isLoading || fetching) {
    return <LoaderView/>;
  }

  if (error && !title) {
    return <ErrorView onRetry={handleNewStoryRequest} />;
  };

  return (
    <ThemedView
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onResponderGrant={handleBallMovement}
      onLayout={handleLayout}
    >
      {isBallMoving && <BallComponent startPosition={ballPosition} containerDimensions={containerDimensions} />}
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
        <TheStoryText/>
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
        <FairytaleButton onPress={handleNewStoryRequest} disabled={isLoading || fetching} />
        :
        <FairytaleButton customText={'Хочу'}  onPress={handleNewStoryRequest} disabled={isLoading || fetching} />
      }
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f5f5f5',
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
    color: '#DAA520',
    textAlign: 'center',
    lineHeight: 40,
    fontFamily: 'VezitsaCyrillic',
  },
  emptyTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#DAA520',
    textAlign: 'center',
    lineHeight: 50,
    fontFamily: 'VezitsaCyrillic',
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
  loaderAnimation: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;
