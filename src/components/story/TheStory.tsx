import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated, Dimensions, Text, ScrollView } from 'react-native';
import StoryContent from './StoryContent';
import StoryTitle from './StoryTitle';
import LottieView from 'lottie-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface StoryContentProps {
  title: string;
  content: string;
  disabledButtons?: boolean;
  isDarkMode?: boolean;
}

const emptyStoryContent = `Похоже, вы не загрузили ни одной сказки.
Загрузите сказку.`;

const TheStory: React.FC<StoryContentProps> = ({
  title,
  content,
  disabledButtons,
  isDarkMode = false,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const styles = getStyles(isDarkMode);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [title, content]);

  if (!content && !title) {
    return (
      <View style={styles.placeholderContainer}>
        <LottieView
          source={require('../../assets/lottie/book_switch_pages.json')}
          autoPlay
          loop
          style={styles.loaderAnimation}
        />
        <Text style={styles.placeholderText}>{emptyStoryContent}</Text>
      </View>
    );
  }

  const titleHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [100, 60],
    extrapolate: 'clamp',
  });

  const titleFontSize = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [SCREEN_WIDTH * 0.08, SCREEN_WIDTH * 0.05],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.storyContainer}>
      {title && (
        <Animated.View style={[styles.fixedTitle, { height: titleHeight }]}>
          <StoryTitle
            title={title.replace(/^"|"$/g, '')}
            isDarkMode={isDarkMode}
            animatedFontSize={titleFontSize}
          />
        </Animated.View>
      )}
      <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.storyScrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {content && (
          <StoryContent content={content} disabledButtons={disabledButtons} isDarkMode={isDarkMode} />
        )}
      </Animated.ScrollView>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    storyContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: isDarkMode ? '#f5e8c6' : '#FAF3E0',
      paddingBottom: 10,
      elevation: 3,
      shadowColor: isDarkMode ? '#000' : '#999', 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.07,
      shadowRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#BA8F64',
      borderRadius: 5,
    },
    storyScrollContent: {
      flexGrow: 1,
      paddingTop: 82,
    },
    fixedTitle: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      backgroundColor: isDarkMode ? '#f5e8c6' : '#FAF3E0',
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
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
      paddingHorizontal: 30,
      fontSize: SCREEN_WIDTH * 0.07,
      marginTop: 10,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFA500' : '#DAA520',
      textAlign: 'center',
      lineHeight: 30,
      fontFamily: 'VezitsaCyrillic',
    },
  });

export default TheStory;