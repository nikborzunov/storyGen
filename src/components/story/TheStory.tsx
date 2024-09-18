import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions } from 'react-native';
import StoryContent from './StoryContent';
import StoryTitle from './StoryTitle';
import LottieView from 'lottie-react-native';

// Получение размеров экрана
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface StoryContentProps {
  title: string;
  content: string;
  disabledButtons?: boolean;
  isDarkMode?: boolean;
  onTryAgain?: () => void;
}

const TheStory: React.FC<StoryContentProps> = ({ title, content, disabledButtons, isDarkMode = false, onTryAgain }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  
  const styles = getStyles(isDarkMode);

  if (!content && !title) {
    return (
      <View style={styles.placeholderContainer}>
        <LottieView
          source={require('../../assets/lottie/book_switch_pages.json')}
          autoPlay
          loop
          style={styles.loaderAnimation}
        />
        <Text style={styles.placeholderText}>Кажется, сказка сейчас отсутствует.</Text>
      </View>
    );
  }

  return (
    <View style={styles.storyContainer}>
      <>
        {title && <StoryTitle title={title.replace(/^"|"$/g, '')} isDarkMode={isDarkMode} />}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.storyScrollContent}
        >
          {content && <StoryContent content={content} disabledButtons={disabledButtons} isDarkMode={isDarkMode} />}
        </ScrollView>
      </>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: SCREEN_WIDTH * 0.05,  // Комфортные боковые отступы
      paddingVertical: SCREEN_HEIGHT * 0.03, 
      backgroundColor: isDarkMode ? '#121212' : '#F7F7F7',  // Фон экрана будет повторять общую палитру
    },
    storyContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: isDarkMode ? '#2B2B2B' : '#FFFFFF',  // Контейнер для истории становится похожим на страницу бумаги
      borderRadius: 16,  // Заокругляем углы
      padding: SCREEN_WIDTH * 0.06,  // Добавляем пространства для страниц текста
      marginBottom: SCREEN_HEIGHT * 0.03,
      maxHeight: SCREEN_HEIGHT * 0.7,  // Ограничиваем высоту для коротких историй, но с пространством внизу
      elevation: 3,
      shadowColor: isDarkMode ? '#000' : '#AAA',  // Разные тени для темного и светлого режимов
      shadowOffset: { width: 0, height: 5 }, // Несколько увеличенная высота теней для сказочного эффекта "парящего листа"
      shadowOpacity: 0.1,
      shadowRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#D4A373',   // Повторяем контур приятного бежевого оттенка, как у настоящей бумаги
    },
    buttonContainer: {
      alignItems: 'center',
      marginBottom: SCREEN_HEIGHT * 0.06,  // Увеличиваем нижний отступ для кнопки
      backgroundColor: isDarkMode ? '#333333' : '#EDE7D7',  // Мягкий фон для кнопки, чтобы выделить ее среди текста
      paddingVertical: SCREEN_HEIGHT * 0.02,
      borderRadius: 8,
      shadowColor: isDarkMode ? '#000' : '#AAA',  // Легкая тень для кнопки
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    storyScrollContent: {
      flexGrow: 1,
    },
    placeholderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      backgroundColor: isDarkMode ? '#121212' : '#f4f4f4', // Темные и светлые фоны для placeholder
    },
    loaderAnimation: {
      width: SCREEN_WIDTH * 0.4,
      height: SCREEN_WIDTH * 0.4,
    },
    placeholderText: {
      fontSize: SCREEN_WIDTH * 0.04,
      color: isDarkMode ? '#e0e0e0' : '#555555',
      textAlign: 'center',
      marginTop: 16,
    },
  });

export default TheStory;