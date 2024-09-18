import React, { useState, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import FairytaleButton from '../buttons/FairytaleButton';
import { useAppSelector } from '@/src/hooks/redux';
import { DEFAULT_ERROR_MESSAGE } from '@/src/constants/errorMessages';
import { useNavigation } from 'expo-router';

const ErrorView = ({ onRetry, errorMessage, errorStatus }: { onRetry: () => void; errorMessage?: string, errorStatus?: string }) => {
  const [isDirty, setDirty] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const navigation = useNavigation<any>();

  const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
  const isDarkMode = toggleConfig['darkMode']?.checked;

  const retryOnError = () => {
    setDirty(true);
    onRetry();
  };

  const hasCyrillic = (text: string) => {
    return /[а-яА-ЯЁё]/.test(text);
  };

  const displayMessage = hasCyrillic(errorMessage || '') ? errorMessage : DEFAULT_ERROR_MESSAGE;

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

  const handleLoginRedirect = () => {
    navigation.navigate('settings', { isAuthModalOpen: true});
  };

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
        { String(errorStatus) === '401' ? "Вы не авторизованы" : displayMessage}
      </Animated.Text>
      {errorMessage?.includes("не авторизованы") || errorMessage?.includes("userId must be a string") || String(errorStatus) === '401' ? (
        <FairytaleButton customText={'Авторизоваться'} onPress={handleLoginRedirect} />
      ) : (
        <FairytaleButton customText={'Обновить'} onPress={retryOnError} disabled={isDirty} />
      )}
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