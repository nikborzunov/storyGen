import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  Animated,
  Vibration,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import BallComponent from '@/components/animation/ball';
import TheStoryText from '@/components/TheStoryText';
import FairytaleButton from '@/components/buttons/FairytaleButton';
import LoaderView from '@/components/loaders/loaderView';
import ErrorView from '@/components/errors/errorView';
import { useStoryFetch } from '@/hooks/useStoryFetch';

const HomeScreen: React.FC = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [blinkAnim] = useState(new Animated.Value(1));
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [isBallMoving, setIsBallMoving] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  const { isLoading, error, title, fairytaleText, fetchData, canRequestNewStory } = useStoryFetch();

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
        <TheStoryText fairytaleText={fairytaleText} />
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
    fontSize: 50,
    fontWeight: 'bold',
    color: '#DAA520',
    textAlign: 'center',
    lineHeight: 60,
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