import React, { useState, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import FairytaleButton from '../buttons/FairytaleButton';
import { useAppSelector } from '@/src/hooks/redux';

const ErrorView = ({ onRetry, errorMessage }: { onRetry: () => void; errorMessage: string }) => {
  const [isDirty, setDirty] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
  const isDarkMode = toggleConfig['darkMode']?.checked;

  const retryOnError = () => {
    setDirty(true);
    onRetry();
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setDirty(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.loaderContainer}>
      <LottieView
        source={require('../../assets/lottie/errorSmile.json')}
        autoPlay
        loop
        style={styles.loaderAnimation}
      />
      <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
        {errorMessage}
      </Animated.Text>
      <FairytaleButton customText={'Обновить'} onPress={retryOnError} disabled={isDirty} />
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
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFA500' : '#DAA520',
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: 'VezitsaCyrillic',
    marginTop: 20,
  },
});

export default ErrorView;