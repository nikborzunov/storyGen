import React, { useState } from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import FairytaleButton from '../buttons/FairytaleButton';
import { useAppSelector } from '@/src/hooks/redux';

const ErrorView = ({ onRetry }: { onRetry: () => void }) => {
  const [isDirty, setDirty] = useState(false);

  const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
  const isDarkMode = toggleConfig['darkMode']?.checked;

  const retryOnError = () => {
    setDirty(true);
    onRetry();
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
    <Animated.Text style={styles.loadingText}>
      {`Упс.. Что-то пошло не так.
      \n Мы знаем о проблеме и уже работаем.
      \n Попробуйте обновить страницу или зайти позже.`}
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