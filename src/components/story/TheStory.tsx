import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions } from 'react-native';
import StoryContent from './StoryContent';
import StoryTitle from './StoryTitle';
import LottieView from 'lottie-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

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
        <Text style={styles.placeholderText}>Похоже, сказка отсутствует.</Text>
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
    storyContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#FAF3E0',
      paddingBottom: 10,
      elevation: 3,
      shadowColor: isDarkMode ? '#000' : '#999', 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.07,
      shadowRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#BA8F64',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
    },
    storyScrollContent: {
      flexGrow: 1,
    },
    placeholderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      backgroundColor: isDarkMode ? '#121212' : '#FAF3E0',
    },
    loaderAnimation: {
      width: SCREEN_WIDTH * 0.4,
      height: SCREEN_WIDTH * 0.4,
    },
    placeholderText: {
      fontSize: SCREEN_WIDTH * 0.04,
      color: isDarkMode ? '#e0e0e0' : '#777777',
      textAlign: 'center',
      marginTop: 16,
    },
  });

export default TheStory;