import React from 'react';
import { ThemedText } from '@/src/components/ThemedText';
import { StyleSheet, View, Dimensions } from 'react-native';

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
  const titleColor = '#FFD700';
  const textOutlineColor = '#000000';

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: SCREEN_HEIGHT * 0.01,
      marginBottom: SCREEN_HEIGHT * 0.01, 
    },
    title: {
      fontSize: SCREEN_WIDTH * 0.07,
      fontWeight: 'bold',
      color: titleColor,
      textAlign: 'center', 
      lineHeight: SCREEN_WIDTH * 0.08,
      fontFamily: 'VezitsaCyrillic',
      textShadowColor: textOutlineColor,

      shadowOpacity: 1,
      textShadowRadius: 4,
      textShadowOffset: { width: 2, height: 2 },
    },
    emptyTitle: {
      fontSize: SCREEN_WIDTH * 0.075,
      fontWeight: 'bold',
      color: titleColor, 
      textAlign: 'center', 
      lineHeight: SCREEN_WIDTH * 0.09,
      fontFamily: 'VezitsaCyrillic',
      textShadowColor: textOutlineColor,
      textShadowRadius: 4,
      shadowOpacity: 1,
      textShadowOffset: { width: 2, height: 2 },
    },
  });
};

export default StoryTitle;