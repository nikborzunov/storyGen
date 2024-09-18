import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/src/hooks/redux';
import { addHistory } from '@/src/store/reducers/StorySlice';
import { storyAPI } from '@/src/services/StoryService';
import { IStory } from '@/src/typing/story';

const useStoryData = (storyIdFromHistory: string | undefined) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [errorStatus, setStatus] = useState<string | null>(null);

  const [fetching, setFetching] = useState(false);

  const dispatch = useAppDispatch();

  // Получаем библиотеку и историю из Store
  const library = useAppSelector(state => state?.story?.library);
  const history = useAppSelector(state => state?.story?.history);
  const userId = useAppSelector(state => state.auth.userId);

  // Ленивая загрузка историй через RTK Query
  const [fetchStories, { isLoading, error }] = storyAPI.useLazyFetchAllStoriesQuery();

  // Список просмотренных историй
  const viewedStoryIds = useMemo(
    () => history.map(item => item.storyId),
    [history]
  );

  // Фильтрация непрочитанных историй
  const unreadStories: IStory[] = useMemo(
    () => library.filter(story => !viewedStoryIds.includes(story.storyId)),
    [library, viewedStoryIds]
  );

  // Выбираем текущую сказку по ID или первую непрочитанную сказку
  const currentStory = useMemo(() => {
    if (storyIdFromHistory) {
      return library.find(story => story.storyId === storyIdFromHistory);
    }
    return unreadStories[0] || null;
  }, [storyIdFromHistory, unreadStories, library]);

  // Локальные состояния для выбранной сказки
  const [title, setTitle] = useState(currentStory?.title || '');
  const [content, setContent] = useState(currentStory?.content || '');

  // Устанавливаем новую сказку и добавляем в историю просмотров
  const setStory = useCallback((story: IStory) => {
    if (story) {
      setTitle(story.title || '');
      setContent(story.content || '');
    }
  }, []);

  // Устанавливаем текущую сказку при изменении
  useEffect(() => {
    if (currentStory) {
      setStory(currentStory);
    }
  }, [currentStory, setStory]);

  /**
   * Метод для запроса следующей сказки:
   * 1. Проверяет, есть ли непрочитанные сказки в Store.
   * 2. Если все сказки прочитаны, выполняет запрос на сервер для загрузки новых сказок.
   */
  const handleNewStoryRequest = useCallback(async (themes: string[], isScreenBlocked: boolean) => {
    if (isScreenBlocked || fetching) return;

    // Если есть непрочитанные сказки в Store
    if (unreadStories.length > 0) {
      console.log("Берем следующую непрочитанную историю из Store.");
      setStory(unreadStories[0]);

      // Добавляем в историю только ту историю, которая показана
      const selectedStory = unreadStories[0];
      dispatch(addHistory([{ storyId: selectedStory.storyId, title: selectedStory.title, userId: userId || '' }]));
      
      return;
    }

    // Если все истории просмотрены — загружаем новые с сервера
    console.log("Все сказки прочитаны. Загружаем новые с сервера...");
    setFetching(true);
    setErrorMessage(null); // Очищаем возможные ошибки
		setStatus(null);

    const requestBody = { themes, viewedStories: history, userId: userId ?? '' };
    console.log('Запрос на сервер:', requestBody);

    try {
      await fetchStories(requestBody).unwrap(); // Загружаем новые сказки
    } catch (err) {
      console.error("Ошибка загрузки сказки:", (err as any)?.message);
      setErrorMessage('Ошибка загрузки сказки. Попробуйте позже.');
			setStatus((err as any)?.status);
    } finally {
      setFetching(false);
    }
  }, [unreadStories, history, userId, setStory, fetching, fetchStories, dispatch]);

  // Обрабатываем ошибки запроса на сервер
  useEffect(() => {
    if (error) {
      setErrorMessage('Произошла ошибка при загрузке историй.');
			setStatus((error as any)?.status);
      console.error('Ошибка во время загрузки:', (error as any)?.message);
    }
  }, [error]);

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