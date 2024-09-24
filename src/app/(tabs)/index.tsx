import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import TheStory from '@/src/components/story/TheStory';
import FairytaleButton from '@/src/components/buttons/FairytaleButton';
import LoaderView from '@/src/components/loaders/loaderView';
import { ThemedView } from '@/src/components/ThemedView';
import { useAppSelector } from '@/src/hooks/redux';
import { DEFAULT_ERROR_MESSAGE } from '@/src/constants/errorMessages';
import ErrorView from '@/src/components/errors/errorView';
import useStoryData from '@/src/hooks/useStoryData';
import { useDidUpdate } from '@/src/hooks/useDidUpdate';
import StoryAudioPlayer from '@/src/components/player/StoryAudioPlayer';

type RootStackParamList = {
  HomeScreen: { storyId: string };
};

const getErrorStatus = (errorStatus: string | undefined, isAuthenticated: boolean): string => {
  if (errorStatus) {
    return errorStatus;
  }

  if (!isAuthenticated) {
    return '401';
  }

  return '';
};

const HomeScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'HomeScreen'>>();
  const storyIdFromHistory = route.params?.storyId;

  const { title, content, audioUrl, isLoading, handleNewStoryRequest, errorMessage, errorStatus } = useStoryData(storyIdFromHistory);

  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const selectedThemesFromStore = useAppSelector(state => state?.settings?.selectedThemes);
  const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
  const isDarkMode = toggleConfig['darkMode']?.checked;
  const isScreenBlocked = toggleConfig['blockScreen']?.checked;

  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useDidUpdate(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, []);

  const themes: string[] = selectedThemesFromStore?.filter(item => item.checked).map(item => item.name) ?? [];

  const styles = getStyles(isDarkMode);

  if (isLoading) {
    return <LoaderView />;
  }

  if (errorMessage || (isInitialized && !isAuthenticated)) {
    return (
      <ErrorView
        onRetry={() => handleNewStoryRequest(themes, isScreenBlocked)}
        errorMessage={errorMessage || DEFAULT_ERROR_MESSAGE}
        errorStatus={getErrorStatus(errorStatus || '', isAuthenticated)}
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.storyContainer}>
        <TheStory
          title={title}
          content={content}
          disabledButtons={isScreenBlocked}
          isDarkMode={isDarkMode}
        />
      </View>
      <View style={styles.audioContainer}>
        <StoryAudioPlayer audioUrl={audioUrl} />
      </View>
      <View style={styles.buttonContainer}>
        { title ?
        ( <FairytaleButton
            onPress={() => handleNewStoryRequest(themes, isScreenBlocked)}
            blocked={isScreenBlocked}
          /> ) 
        :
        ( <FairytaleButton
            onPress={() => handleNewStoryRequest(themes, isScreenBlocked)}
            blocked={isScreenBlocked}
            customText='Загрузить сказку'
            animation='pulse'
          /> )}
      </View>
    </ThemedView>
  );
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20,
      backgroundColor: isDarkMode ? '#f5e8c6' : '#FAF3E0',
    },
    storyContainer: {
      flex: 0.8,
      justifyContent: 'center',
      backgroundColor: isDarkMode ? '#2B2B2B' : '#FFFFFF',
      borderRadius: 5,
      elevation: 2,
      shadowColor: isDarkMode ? '#000' : '#AAA',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    scrollView: {
      maxHeight: SCREEN_HEIGHT * 0.7,
    },
    audioContainer: {
      flex: 0.1,
      justifyContent: 'center',
    },
    buttonContainer: {
      flex: 0.1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
  });

export default HomeScreen;