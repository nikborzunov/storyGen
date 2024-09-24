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
    return storyIdFromHistory
      ? library.find(story => story.storyId === storyIdFromHistory)
      : unreadStories[0] || null;
  }, [storyIdFromHistory, unreadStories, library]);

  const [title, setTitle] = useState(currentStory?.title || '');
  const [content, setContent] = useState(currentStory?.content || '');
  const [audioUrl, setAudio] = useState(currentStory?.title || '');

  const setStory = useCallback((story: IStory) => {
    setTitle(story.title || '');
    setContent(story.content || '');
    setAudio(story.audioUrl);
  }, []);

  useEffect(() => {
    if (currentStory) {
      setStory(currentStory);
    }
  }, [currentStory, setStory]);

  const processNewStories = async (newStories: IStory[]) => {
    const uniqueNewStories = newStories.filter(story => !viewedStoryIds.includes(story.storyId));

    if (uniqueNewStories.length) {
      const nextUnreadStory = uniqueNewStories[0];

      await dispatch(addHistory([{ 
        storyId: nextUnreadStory.storyId, 
        title: nextUnreadStory.title, 
        userId: userId || '' 
      }]));

      setStory(nextUnreadStory);
    };
  };

  const handleNewStoryRequest = useCallback(
    async (themes: string[], isScreenBlocked: boolean) => {
      if (isScreenBlocked || fetching) return;

      setFetching(true);
      setErrorMessage(null);
      setErrorStatus(null);

      const requestBody = { themes, viewedStories: history, userId: userId ?? '' };

      try {
        if (unreadStories.length > 0) {
          const currentIndex = library.findIndex(story => story.storyId === currentStory?.storyId);
          const nextStoryIndex = currentIndex + 1;

          if (nextStoryIndex >= unreadStories.length) {

            const response = await fetchStories(requestBody).unwrap();

            await processNewStories(response.data.stories);
          } else {
            const selectedStory = unreadStories[nextStoryIndex];
            if (selectedStory) {

              await dispatch(addHistory([{ 
                storyId: selectedStory.storyId, 
                title: selectedStory.title, 
                userId: userId || '' 
              }]));

              setStory(selectedStory);
            };
          };
        } else {
          const response = await fetchStories(requestBody).unwrap();
          
          await processNewStories(response.data.stories);
        };
      } catch (err) {
        console.error('Ошибка загрузки сказки:', (err as any)?.message);
        setErrorMessage('Ошибка загрузки сказки. Попробуйте позже.');
        setErrorStatus((err as any)?.status);
      } finally {
        setFetching(false);
      };
    },
    [unreadStories, history, userId, setStory, fetching, fetchStories, dispatch, currentStory, library]
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
      setErrorMessage(null);
    };
  }, [isAuthenticated, userId]);

  return {
    title,
    content,
    audioUrl,
    isLoading: isLoading || fetching,
    errorMessage,
    errorStatus,
    handleNewStoryRequest,
  };
};

export default useStoryData;