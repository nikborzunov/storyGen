import React from 'react';
import { ThemedText } from '@/src/components/ThemedText';
import { StyleSheet, View } from 'react-native';

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

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFD700' : '#DAA520',
    textAlign: 'center',
    lineHeight: 40,
    fontFamily: 'VezitsaCyrillic',
  },
  emptyTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFD700' : '#DAA520',
    textAlign: 'center',
    lineHeight: 50,
    fontFamily: 'VezitsaCyrillic',
  },
});

export default StoryTitle;