import React from 'react';
import { StyleSheet, View, Dimensions, Animated } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface StoryTitleProps {
  title: string;
  isDarkMode: boolean;
  animatedFontSize: Animated.AnimatedInterpolation<number>;
}

const StoryTitle: React.FC<StoryTitleProps> = ({ title, isDarkMode, animatedFontSize }) => {
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      {title ? (
        <Animated.Text style={[styles.title, { fontSize: animatedFontSize }]}>
          {title}
        </Animated.Text>
      ) : (
        <Animated.Text style={[styles.emptyTitle, { fontSize: animatedFontSize }]}>
          {'Хочешь сказку?'}
        </Animated.Text>
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
    },
    title: {
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