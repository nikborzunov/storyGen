import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/src/hooks/redux';
import { addHistory } from '@/src/store/reducers/StorySlice';
import { storyAPI } from '@/src/services/StoryService';
import { IStory } from '@/src/typing/story';

const useStoryData = (storyIdFromHistory: string | undefined) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const dispatch = useAppDispatch();

  const library = useAppSelector(state => state?.story?.library);
  const history = useAppSelector(state => state?.story?.history);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const userId = useAppSelector(state => state.auth.userId);

  const [fetchStories, { isLoading, error }] = storyAPI.useLazyFetchAllStoriesQuery();

  const viewedStoryIds = useMemo(
    () => history.map(item => item.storyId),
    [history]
  );

  const unreadStories: IStory[] = useMemo(
    () => library.filter(story => !viewedStoryIds.includes(story.storyId)),
    [library, viewedStoryIds]
  );

  const currentStory = useMemo(() => {
    if (storyIdFromHistory) {
      return library.find(story => story.storyId === storyIdFromHistory);
    }
    return unreadStories[0] || null;
  }, [storyIdFromHistory, unreadStories, library]);

  const [title, setTitle] = useState(currentStory?.title || '');
  const [content, setContent] = useState(currentStory?.content || '');

  const setStory = useCallback((story: IStory) => {
    if (story) {
      setTitle(story.title || '');
      setContent(story.content || '');
    }
  }, []);

  useEffect(() => {
    if (currentStory) {
      setStory(currentStory);
    }
  }, [currentStory, setStory]);

  const handleNewStoryRequest = useCallback(
    async (themes: string[], isScreenBlocked: boolean) => {
      if (isScreenBlocked || fetching) return;

      if (unreadStories.length > 0) {
        console.log('Берем следующую непрочитанную историю из Store.');
        setStory(unreadStories[0]);

        const selectedStory = unreadStories[0];
        dispatch(
          addHistory([{ storyId: selectedStory.storyId, title: selectedStory.title, userId: userId || '' }])
        );

        return;
      }

      console.log('Все сказки прочитаны. Загружаем новые с сервера...');
      setFetching(true);
      setErrorMessage(null);
      setErrorStatus(null);

      const requestBody = { themes, viewedStories: history, userId: userId ?? '' };
      console.log('Запрос на сервер:', requestBody);

      try {
        await fetchStories(requestBody).unwrap();
      } catch (err) {
        console.error('Ошибка загрузки сказки:', (err as any)?.message);
        setErrorMessage('Ошибка загрузки сказки. Попробуйте позже.');
        setErrorStatus((err as any)?.status);
      } finally {
        setFetching(false);
      }
    },
    [unreadStories, history, userId, setStory, fetching, fetchStories, dispatch]
  );

  useEffect(() => {
    if (error) {
      setErrorMessage('Произошла ошибка при загрузке историй.');
      setErrorStatus((error as any)?.status);
      console.error('Ошибка во время загрузки:', (error as any)?.message);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated && userId) {

      console.log('Пользователь авторизован, можно загрузить историю просмотров и очистить ошибки.');
      setErrorMessage(null);

    }
  }, [isAuthenticated, userId]);

  return {
    title,
    content,
    isLoading: isLoading || fetching,
    errorMessage,
    errorStatus,
    handleNewStoryRequest,
  };
};

export default useStoryData;