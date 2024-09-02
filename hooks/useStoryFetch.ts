import { logger } from '@/helpers/logger';
import { useCallback, useState } from 'react';

interface StoryData {
	title: string;
	content: string;
}

const API_URL = 'http://192.168.0.103:1001/story/create';

export function useStoryFetch() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [fairytaleText, setFairytaleText] = useState('');
  const [canRequestNewStory, setCanRequestNewStory] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCanRequestNewStory(false);
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeOfStory: 'Два лисенка' }),
      });

      if (!response.ok) {
        logger.error('Network response was not ok:', response);
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      const data = parseStoryData(responseData);

      setTitle(data.title);
      setFairytaleText(data.content);

      setTimeout(() => {
        setCanRequestNewStory(true);
      }, 5000);
    } catch (error: unknown) {
      logger.error('Error fetching data:', error);
      const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    title,
    fairytaleText,
    fetchData,
    canRequestNewStory
  };
}

export const parseStoryData = (data: any): StoryData => {
	if (!data?.data) {
		throw new Error('Нет поля data в ответе');
	}

	const { title, content } = data.data;

	if (title === undefined || content === undefined) {
		throw new Error('Полученные данные не содержат title или content');
	}

	return { 
		title: title.replace(/"/g, ''),
		content: content || '' 
	};
};