import React, { useEffect } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { useAppSelector } from '@/src/hooks/redux';

const LoaderView: React.FC = () => {
  const blinkAnim = new Animated.Value(1);
  const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
  const isDarkMode = toggleConfig['darkMode']?.checked;

  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );

    blinkAnimation.start();

    return () => blinkAnimation.stop();
  }, [blinkAnim]);

  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.loaderContainer}>
      <LottieView
        source={require('../../assets/lottie/flower.json')}
        autoPlay
        loop
        style={styles.loaderAnimation}
      />
      <Animated.Text style={[styles.loadingText, { opacity: blinkAnim }]}>
        Придумываем сказку
      </Animated.Text>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
  },
  loaderAnimation: {
    width: 200,
    height: 200,
  },
  loadingText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFD700' : '#DAA520',
    textAlign: 'center',
    lineHeight: 60,
    fontFamily: 'VezitsaCyrillic',
    marginTop: 20,
  },
});

export default LoaderView;