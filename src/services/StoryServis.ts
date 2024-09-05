import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IStory } from '../typing/story';
import { addStoryToHistory, addStoryToLibrary } from '../store/reducers/StorySlice';

const API_URL = 'http://192.168.0.103:1001';

export const storyAPI = createApi({
	reducerPath: 'storyAPI',
	baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
	endpoints: (build) => ({
		fetchAllStories: build.query<{data: IStory}, string[]>({
			query: (body) => ({
				url: '/story/create',
				method: 'POST',
				params: {},
				body: body,
			}),
			async onQueryStarted(arg, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;

					const title = data?.data?.title.replace(/^"|"$/g, '');
					const content = data?.data?.content.replace(/^"|"$/g, '');

					dispatch(addStoryToLibrary({ title: title, content: content }));
					dispatch(addStoryToHistory(title));

				} catch (error) {
					console.error('Ошибка при получении данных:', error);
				}
			}
		})
	})
});