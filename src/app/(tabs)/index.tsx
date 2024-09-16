import BallComponent from '@/src/components/animation/ball';
import FairytaleButton from '@/src/components/buttons/FairytaleButton';
import ErrorView from '@/src/components/errors/errorView';
import LoaderView from '@/src/components/loaders/loaderView';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import TheStoryText from '@/src/components/TheStoryText';
import { useAppSelector } from '@/src/hooks/redux';
import { storyAPI } from '@/src/services/StoryService';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Animated,
  Vibration,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { addHistory } from '@/src/store/reducers/StorySlice';
import { useDispatch } from 'react-redux';
import { DEFAULT_ERROR_MESSAGE } from '@/src/constants/errorMessages';
import { useDidUpdate } from '@/src/hooks/useDidUpdate';

type RootStackParamList = {
  HomeScreen: { storyId: string };
};

const HomeScreen: React.FC = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [blinkAnim] = useState(new Animated.Value(1));
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [isBallMoving, setIsBallMoving] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [remainingStories, setRemainingStories] = useState(0);
  const [contentFromHistory, setContentFromHistory] = useState<string | undefined>('');
  const [fetching, setFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();

  const route = useRoute<RouteProp<RootStackParamList, 'HomeScreen'>>();
  const storyIdFromHistory = route.params?.storyId;

  const userId = useAppSelector(state => state.auth.userId);
  const selectedThemesFromStore = useAppSelector(state => state?.settings?.selectedThemes);
  const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
  const isDarkMode = toggleConfig['darkMode']?.checked;
  const isGameMode = toggleConfig['gameMode']?.checked;
  const isScreenBlocked = toggleConfig['blockScreen']?.checked;
  const scrollViewRef = useRef<ScrollView>(null);

  const library = useAppSelector(state => state?.story?.library);
  const history = useAppSelector(state => state?.story?.history);

  const themes: string[] = [];

  selectedThemesFromStore?.forEach((item) => {
    if (item?.checked) {
      themes.push(item?.name);
    }
  });

  const [fetchStories, { data: story, isLoading, error }] = storyAPI.useLazyFetchAllStoriesQuery();

  storyAPI.useFetchHistoryByUserIdQuery(userId || '', {
    skip: !userId,
    refetchOnMountOrArgChange: true
  });

  useDidUpdate(() => {
    if (error) {
      let errorMessage: string;
  
      if ('status' in error && 'data' in error) {
        errorMessage = (error.data as { message?: string })?.message || 'Произошла ошибка при загрузке историй';
      } else if ('message' in error) {
        errorMessage = error.message || 'Произошла ошибка при загрузке историй';
      } else {
        errorMessage = 'Произошла ошибка при загрузке историй';
      }
  
      setErrorMessage(errorMessage);
    }
  }, [isLoading, error]);


  useDidUpdate(() => {

    if (!isLoading && library?.length) {
      const viewedStoryIds = history?.map(item => item?.storyId);
      const unreadStoriesCount = library.filter(item => !viewedStoryIds.includes(item?.storyId)).length;

      if (unreadStoriesCount < 1) {
        setFetching(true);
        setContentFromHistory(undefined);
        setErrorMessage(null);

        const viewedStorySet = new Set(history?.map(item => item?.storyId));
        let historyParam = [...history] || [];

        let curStory = library.find(item =>
            !viewedStorySet.has(item?.storyId) &&
            item?.title?.replace(/^"|"$/g, '') !== title
        );
        
        if (curStory && !viewedStorySet.has(curStory?.storyId)) {
          historyParam.push({ storyId: curStory?.storyId, title: curStory?.title, userId: userId || '' });
        }
        
        const requestBody = {
            themes,
            viewedStories: historyParam,
            userId: userId,
        };
              
        fetchStories(requestBody).unwrap();
      } else if (library?.length === unreadStoriesCount) {
        const curHistory = history?.map((item) => item?.storyId);
        const curStory: any = library.find((item) => !curHistory.includes(item?.storyId));

        if (curStory && !curHistory.includes(curStory?.storyId)) {
            dispatch(addHistory([{ storyId: curStory?.storyId, title: curStory?.title?.replace(/^"|"$/g, ''), userId: userId || '' }]));
        }

        setTitle(curStory?.title?.replace(/^"|"$/g, ''));
        setContent(curStory?.content?.replace(/^"|"$/g, ''));
      };
    }
  }, [history?.length, library?.length, isLoading])


  useEffect(() => {
    if (storyIdFromHistory) {
      const storyFromHistory = library?.find((item) => item?.storyId?.replace(/^"|"$/g, '') === storyIdFromHistory?.replace(/^"|"$/g, ''));
      if (storyFromHistory) {
        setTitle(storyFromHistory.title?.replace(/^"|"$/g, ''));
        setContentFromHistory(storyFromHistory.content);
      }
    }
  }, [route?.params]);

  const animateTitleAndFetchData = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    animateTitleAndFetchData();
  }, []);

  useDidUpdate(() => {
    if (library && history) {
        const viewedStoryIds = history?.map(item => item?.storyId);
        const unreadStoriesCount = library.filter(item => !viewedStoryIds.includes(item?.storyId)).length;
        setRemainingStories(unreadStoriesCount);
    }
  }, [library, history]);

  const addToHistory = () => {
    const viewedStoryIds = history?.map((item) => item?.storyId);

    const curStory = library.find((item) =>
      !viewedStoryIds.includes(item?.storyId) &&
        item?.title?.replace(/^"|"$/g, '') !== title
    );

    if (curStory) {
      if (!viewedStoryIds.includes(curStory?.storyId)) {
        dispatch(addHistory([{ storyId: curStory?.storyId, title: curStory?.title, userId: userId || '' }]));

        setTitle(curStory?.title?.replace(/^"|"$/g, ''));
        setContent(curStory?.content?.replace(/^"|"$/g, ''));
      }
    };
  };

  const handleNewStoryRequest = async () => {
    if (isScreenBlocked) return;

    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setFetching(true);
    setContentFromHistory(undefined);
    setErrorMessage(null);

    const requestBody = {
        themes,
        viewedStories: history,
        userId: userId,
    };

    try {
        if (library?.length < 1 || !title?.length || remainingStories < 1) {
            await fetchStories(requestBody).unwrap();
        } else {

          addToHistory();
          
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    } catch (error) {
        setErrorMessage("Не удалось загрузить новую сказку. Пожалуйста, измените список тем или попробуйте снова позже.");
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    } finally {
        setFetching(false);
    }
  };

  const handleBallMovement = ({ nativeEvent: { locationX, locationY } }: { nativeEvent: { locationX: number, locationY: number } }) => {
    if (!isGameMode) return; 
    Vibration.vibrate(500);
    setBallPosition({ x: locationX - 25, y: locationY - 25 });
    setIsBallMoving(true);
  };

  const handleLayout = ({ nativeEvent: { layout } }: { nativeEvent: { layout: { width: number, height: number } } }) => {
    setContainerDimensions({ width: layout.width, height: layout.height });
  };

  const styles = getStyles(isDarkMode);

  if (isLoading || fetching) {
    return <LoaderView/>;
  }

  if (error && !title) {
    return <ErrorView onRetry={handleNewStoryRequest} errorMessage={errorMessage || DEFAULT_ERROR_MESSAGE} />;
  };

  return (
    <ThemedView
      style={styles.container}
      onStartShouldSetResponder={() => isGameMode}
      onResponderGrant={isGameMode ? handleBallMovement : () => {}}
      onLayout={handleLayout}
    >
      {(isBallMoving && isGameMode) && <BallComponent startPosition={ballPosition} containerDimensions={containerDimensions} />}
      {!title ? 
        <Animated.View style={styles.emptyTitleContainer}>
          <ThemedText style={styles.emptyTitle}>{'Хочешь сказку?'}</ThemedText>
        </Animated.View>
      :
        <Animated.View style={styles.titleContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
        </Animated.View>
      }
      {title ? 
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.storyContainer}
      >
        <TheStoryText contentFromHistory={contentFromHistory || content} disabledButtons={isScreenBlocked}/>
      </ScrollView>
    :
      <LottieView
        source={require('../../assets/lottie/book_switch_pages.json')}
        autoPlay
        loop
        style={styles.loaderAnimation}
      />
      }
      {title ?
        <FairytaleButton onPress={handleNewStoryRequest} disabled={isLoading || fetching} blocked={isScreenBlocked} />
        :
        <FairytaleButton customText={'Хочу'}  onPress={handleNewStoryRequest} disabled={isLoading || fetching} blocked={isScreenBlocked} />
      }
    </ThemedView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyTitleContainer: {
    alignItems: 'center',
    marginTop: 100,
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
  storyContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
    elevation: 5,
    shadowColor: isDarkMode ? '#000' : '#000',
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

export default HomeScreen;