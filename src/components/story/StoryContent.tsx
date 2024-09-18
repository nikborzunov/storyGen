import React from 'react';
import { StyleSheet, View } from 'react-native';
import TheStoryText from '../TheStoryText';

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

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  storyContainer: {
    padding: 10,
    borderRadius: 10,
    // backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
  },
  linkText: {
    color: '#1E90FF',
    marginTop: 5,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default StoryContent;