import React from 'react';
import {
  StyleSheet, View
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import TheStory from '@/src/components/story/TheStory';
import FairytaleButton from '@/src/components/buttons/FairytaleButton';
import LoaderView from '@/src/components/loaders/loaderView';
import { ThemedView } from '@/src/components/ThemedView';
import { useAppSelector } from '@/src/hooks/redux';
import { DEFAULT_ERROR_MESSAGE } from '@/src/constants/errorMessages';
import ErrorView from '@/src/components/errors/errorView';
import useStoryData from '@/src/hooks/useStoryData';

type RootStackParamList = {
  HomeScreen: { storyId: string };
};

const HomeScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'HomeScreen'>>();
  const storyIdFromHistory = route.params?.storyId;

  const { title, content, isLoading, handleNewStoryRequest, errorMessage, errorStatus } = useStoryData(storyIdFromHistory);

  const selectedThemesFromStore = useAppSelector(state => state?.settings?.selectedThemes);
  const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
  const isDarkMode = toggleConfig['darkMode']?.checked;
  const isScreenBlocked = toggleConfig['blockScreen']?.checked;

  const themes: string[] = selectedThemesFromStore?.filter(item => item.checked).map(item => item.name) ?? [];

  const styles = getStyles(isDarkMode);

  if (isLoading) {
    return <LoaderView />;
  }

  if (errorMessage) {
    return <ErrorView onRetry={() => handleNewStoryRequest(themes, isScreenBlocked)} errorMessage={errorMessage || DEFAULT_ERROR_MESSAGE} errorStatus={errorStatus || ''}/>;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.storyContainer}>
        <TheStory
          title={title || 'Заголовок отсутствует'}
          content={content || 'Содержимое отсутствует.'}
          disabledButtons={isScreenBlocked}
          isDarkMode={isDarkMode}
        />
      </View>
      <View style={styles.buttonContainer}>
        <FairytaleButton
          onPress={() => handleNewStoryRequest(themes, isScreenBlocked)}
          blocked={isScreenBlocked}
        />
      </View>
    </ThemedView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#f5f5f5',
  },
  storyContainer: {
    flex: 0.8,
    borderRadius: 10,
    backgroundColor: isDarkMode ? '#fff' : '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;