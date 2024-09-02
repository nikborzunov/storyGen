import React, { useState } from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native'; // Импортируйте LottieView
import FairytaleButton from '../buttons/FairytaleButton';

const ErrorView = ({ onRetry }: { onRetry: () => void }) => {
  const [isDirty, setDirty] = useState(false);

  const retryOnError = () => {
    setDirty(true);
    onRetry();
  };

  return (
    <View style={styles.loaderContainer}>
    <LottieView
      source={require('../../assets/lottie/errorSmile.json')}
      autoPlay
      loop
      style={styles.loaderAnimation}
    />
    <Animated.Text style={[styles.loadingText]}>
      {`Упс.. Что-то пошло ни так.
      \n Мы знаем о проблеме и уже работаем.
      \n Попробуйте обновить страницу или зайти позже.`}
    </Animated.Text>
    <FairytaleButton customText={'Обновить'} onPress={retryOnError} disabled={isDirty} />
  </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff', // Белый фон
  },
  loaderAnimation: {
    width: 200,
    height: 200,
  },
  errorText: {
    fontSize: 15,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DAA520',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'VezitsaCyrillic',
    marginTop: 20,
  },
});

export default ErrorView;