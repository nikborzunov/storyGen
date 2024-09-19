import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import TheStoryText from '../TheStoryText';

const SCREEN_WIDTH = Dimensions.get('window').width;

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
      backgroundColor: isDarkMode ? '#f5e8c6' : '#FAF3E0',
      elevation: 3,
      shadowColor: isDarkMode ? '#000' : '#DDD',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      paddingVertical: 18,
      paddingHorizontal: 12,
    },
    storyText: {
      fontSize: SCREEN_WIDTH * 0.045,
      lineHeight: SCREEN_WIDTH * 0.065,
      color: isDarkMode ? '#D1CDAA' : '#3D3D3D',
      fontFamily: 'serif',
      textAlign: 'justify',
    },
    linkText: {
      color: '#E8614D',  
      marginTop: 12,
      textAlign: 'left',
      textDecorationLine: 'underline',
    },
  });
};

export default StoryContent;