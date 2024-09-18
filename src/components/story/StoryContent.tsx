import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import TheStoryText from '../TheStoryText';

// Получение размеров экрана
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface StoryContentProps {
  content: string;
  disabledButtons?: boolean;
  isDarkMode?: boolean;
}

const StoryContent: React.FC<StoryContentProps> = ({ content, disabledButtons, isDarkMode = false }) => {
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.storyContainer}>
      <TheStoryText contentFromHistory={content} disabledButtons={disabledButtons} />
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => {
  return StyleSheet.create({
    storyContainer: {
      borderRadius: 10,  
      backgroundColor: '#FAF3E0', // Легкий теплый оттенок для основного текста
      elevation: 3,
      shadowColor: isDarkMode ? '#000' : '#DDD',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      paddingVertical: 18, // Пространство вокруг текста, чтобы элементы "дышали"
      paddingHorizontal: 12,
    },
    storyText: {
      fontSize: SCREEN_WIDTH * 0.045,
      lineHeight: SCREEN_WIDTH * 0.065,
      color: isDarkMode ? '#D1CDAA' : '#3D3D3D',
      fontFamily: 'serif', // Классический шрифт для сказки
      textAlign: 'justify', // Для лучшего распределения текста по строке, как в книге
    },
    linkText: {
      color: '#E8614D',  
      marginTop: 12,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
  });
};

export default StoryContent;