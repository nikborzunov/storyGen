import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, Animated, GestureResponderEvent, Vibration } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { TheStoryText } from '@/components/TheStoryText';
import { ThemedText } from '@/components/ThemedText';
import BallComponent from '@/components/animation/ball';

// Optional configuration
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const HomeScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [isBallMoving, setIsBallMoving] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const handleBallStart = (evt: GestureResponderEvent) => {
    const { locationX, locationY } = evt.nativeEvent;
    // Обновляем позицию мяча и состояние
    setBallPosition({ x: locationX - 25, y: locationY - 25 });
    setIsBallMoving(true);
  };

  const handleResponderGrant = (evt: GestureResponderEvent) => {
    // Trigger haptic feedback
    Vibration.vibrate([500]); // Настроить вибрацию
    const { locationX, locationY } = evt.nativeEvent; // Местоположение события
    // Обновляем позицию мяча и состояние
    setBallPosition({ x: locationX - 25, y: locationY - 25 });
    setIsBallMoving(true);
  };

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  };

  return (
    <ThemedView 
      style={styles.container} 
      onStartShouldSetResponder={() => true} 
      onResponderGrant={handleResponderGrant}
      onLayout={handleLayout}
    >
      {isBallMoving && <BallComponent startPosition={ballPosition} containerDimensions={containerDimensions} />}
      <Animated.View style={{ 
        ...styles.titleContainer, 
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
      }}>
        <ThemedText style={styles.title}>Сказка про Лисенка</ThemedText>
      </Animated.View>
      <ScrollView contentContainerStyle={styles.storyContainer}>
        <TheStoryText />
      </ScrollView>
    </ThemedView>
  );
}

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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default HomeScreen;