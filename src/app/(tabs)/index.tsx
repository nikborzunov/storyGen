import React from 'react';
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

type RootStackParamList = {
  HomeScreen: { storyId: string };
};

const HomeScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'HomeScreen'>>();
  const storyIdFromHistory = route.params?.storyId;

  // Хук для получения данных о сказке
  const { title, content, isLoading, handleNewStoryRequest, errorMessage, errorStatus } = useStoryData(storyIdFromHistory);

  const selectedThemesFromStore = useAppSelector(state => state?.settings?.selectedThemes);
  const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
  const isDarkMode = toggleConfig['darkMode']?.checked;
  const isScreenBlocked = toggleConfig['blockScreen']?.checked;

  // Список тем для фильтрации историй
  const themes: string[] = selectedThemesFromStore?.filter(item => item.checked).map(item => item.name) ?? [];

  // Генерация стилей
  const styles = getStyles(isDarkMode);

  if (isLoading) {
    return <LoaderView />;
  }

  if (errorMessage) {
    return (
      <ErrorView
        onRetry={() => handleNewStoryRequest(themes, isScreenBlocked)}
        errorMessage={errorMessage || DEFAULT_ERROR_MESSAGE}
        errorStatus={errorStatus || ''}
      />
    );
  }

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
      <View style={styles.buttonContainer}>
        <FairytaleButton
          onPress={() => handleNewStoryRequest(themes, isScreenBlocked)}
          blocked={isScreenBlocked}
        />
      </View>
    </ThemedView>
  );
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: SCREEN_WIDTH * 0.045,  // Чуть меньшие боковые отступы для большего пространства
      paddingVertical: SCREEN_HEIGHT * 0.02,   // Уменьшенный вертикальный отступ, чтобы лучше использовать высоту
      backgroundColor: isDarkMode ? '#121212' : '#F7F7F7',  // Более мягкий светлый фон или тёмный для режима
    },
    storyContainer: {
      flex: 0.85,  // Займем 75% экрана под историю, оставив достаточно места для кнопки
      justifyContent: 'center',
      backgroundColor: isDarkMode ? '#2B2B2B' : '#FFFFFF', // Комфортный для восприятия фон
      borderRadius: 16,
      padding: SCREEN_WIDTH * 0.05,
      elevation: 3,
      shadowColor: isDarkMode ? '#000' : '#AAA', // Разные тени для каждой темы
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      overflow: 'hidden',
    },
    scrollView: {
      maxHeight: SCREEN_HEIGHT * 0.65, // Ограничиваем высоту scrollView контейнера
    },
    buttonContainer: {
      flex: 0.15,  // Оставляем около 15% высоты для кнопки
      alignItems: 'center',
      justifyContent: 'flex-end',  // Кнопка расположена ближе к нижней границе
      marginBottom: SCREEN_HEIGHT * 0.02,  // Отступ между кнопкой и нижней частью экрана
    },
    buttonAlignment: {
      marginBottom: isDarkMode ? SCREEN_HEIGHT * 0.04 : SCREEN_HEIGHT * 0.05,  // Чуть более глубокое расположение кнопки
    },
  });

export default HomeScreen;