import React from 'react';
import { ThemedText } from '@/src/components/ThemedText';
import { StyleSheet, View, Dimensions } from 'react-native';

// Получение размеров экрана
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface StoryTitleProps {
  title: string;
  isDarkMode: boolean;
}

const StoryTitle: React.FC<StoryTitleProps> = ({ title, isDarkMode }) => {
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      {title ? (
        <ThemedText style={styles.title}>{title}</ThemedText>
      ) : (
        <ThemedText style={styles.emptyTitle}>{'Хочешь сказку?'}</ThemedText>
      )}
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => {
  const titleColor = isDarkMode ? '#FFD700' : '#DAA520';  // Цвет золота как акцент, соответствующий ранее выбранной палитре.

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: SCREEN_HEIGHT * 0.02,   // Вертикальные отступы на основе высоты экрана, чтобы сохранить адаптивность
      marginBottom: SCREEN_HEIGHT * 0.02, 
    },
    title: {
      fontSize: SCREEN_WIDTH * 0.07,  // Заголовок должен быть заметным, но не слишком огромным
      fontWeight: 'bold',
      color: titleColor,
      textAlign: 'center', 
      lineHeight: SCREEN_WIDTH * 0.08,
      fontFamily: 'VezitsaCyrillic',  // Назначаем узнаваемый шрифт
      textShadowColor: 'rgba(0, 0, 0, 0.3)', // Добавим легкую тень для большей выразительности
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
    },
    emptyTitle: {
      fontSize: SCREEN_WIDTH * 0.075,  // Немного более увеличенный размер для пустого сообщения
      fontWeight: 'bold',
      color: titleColor, 
      textAlign: 'center', 
      lineHeight: SCREEN_WIDTH * 0.09,
      fontFamily: 'VezitsaCyrillic',
      textShadowColor: 'rgba(0, 0, 0, 0.3)', // Добавляем тень также и для этого текста
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
    },
  });
};

export default StoryTitle;