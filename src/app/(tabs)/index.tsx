import BallComponent from '@/src/components/animation/ball';
import FairytaleButton from '@/src/components/buttons/FairytaleButton';
import ErrorView from '@/src/components/errors/errorView';
import LoaderView from '@/src/components/loaders/loaderView';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import TheStoryText from '@/src/components/TheStoryText';
import { useAppDispatch, useAppSelector } from '@/src/hooks/redux';
import { useStoryFetch } from '@/src/hooks/useStoryFetch';
import { storySlice } from '@/src/store/reducers/StorySlice';
import React, { useEffect, useState, useCallback } from 'react';
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
  
  const dispatch = useAppDispatch();
  const { addStoryToStore } = storySlice.actions;

  const { isLoading, error, title, fairytaleText, fetchData, canRequestNewStory } = useStoryFetch();

  useEffect(() => {
    dispatch(addStoryToStore({ title: title, content: fairytaleText }));
  }, [title, fairytaleText])

  const animateTitleAndFetchData = () => {

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start();

    fetchData();
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

  const handleNewStoryRequest = useCallback(() => {
    if (canRequestNewStory) {
      fetchData();
    }
  }, [fetchData, canRequestNewStory]);

  const handleBallMovement = ({ nativeEvent: { locationX, locationY } }: { nativeEvent: { locationX: number, locationY: number } }) => {
    Vibration.vibrate(500);
    setBallPosition({ x: locationX - 25, y: locationY - 25 });
    setIsBallMoving(true);
  };

  const handleLayout = ({ nativeEvent: { layout } }: { nativeEvent: { layout: { width: number, height: number } } }) => {
    setContainerDimensions({ width: layout.width, height: layout.height });
  };

  if (isLoading) {
    return <LoaderView/>;
  }

  if (error && !title && !fairytaleText) {
    return <ErrorView onRetry={fetchData} />;
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
        <TheStoryText/>
      </ScrollView>
      <FairytaleButton onPress={handleNewStoryRequest} disabled={!canRequestNewStory} />
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
    marginTop: 10,
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
});

export default HomeScreen;
