import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import StoryContent from './StoryContent';
import StoryTitle from './StoryTitle';
import LottieView from 'lottie-react-native';

interface StoryContentProps {
  title: string;
  content: string;
  disabledButtons?: boolean;
  isDarkMode?: boolean;
}

const TheStory: React.FC<StoryContentProps> = ({ title, content, disabledButtons, isDarkMode = false }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.storyContainer}>
      {content || title ? (
        <>
          <StoryTitle title={title?.replace(/^"|"$/g, '')} isDarkMode={isDarkMode} />
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.storyContainer}
          >
            <StoryContent content={content} disabledButtons={disabledButtons} isDarkMode={isDarkMode} />
          </ScrollView>
        </>
      ) : (
        <LottieView
          source={require('../../assets/lottie/book_switch_pages.json')}
          autoPlay
          loop
          style={styles.loaderAnimation}
        />
      )}
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  storyContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  loaderAnimation: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default TheStory;