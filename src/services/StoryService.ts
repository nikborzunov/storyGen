import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IHistory, IStory } from '../typing/story';
import { addHistory, addStoriesToLibrary} from '../store/reducers/StorySlice';

const API_URL = 'http://192.168.0.103:1001';

type IFetchStoryBody = {
	themes: string[];
};

type IStoryLoadResponse = {
	stories: IStory[];
	history: IHistory[];
};

type IStoryLoadByIdResponse = {
  storyId: string;
  title: string;
  content: string;
};

export const storyAPI = createApi({
	reducerPath: 'storyAPI',
	baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
	endpoints: (build) => ({
		fetchAllStories: build.query<{data: IStoryLoadResponse}, IFetchStoryBody>({
			query: (body) => ({
				url: '/story/load',
				method: 'POST',
				params: {},
				body: body,
			}),
			async onQueryStarted(arg, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;

					const stories = data?.data?.stories;
					const history = data?.data?.history;

					dispatch(addStoriesToLibrary(stories));
					dispatch(addHistory(history));

				} catch (error) {
					console.error('Ошибка при получении данных:', error);
				}
			}
		}),
		loadStoryById: build.query<IStoryLoadByIdResponse, string>({
      query: (storyId) => `/story/load?storyId=${storyId}`,
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;
					const story = data?.data
					dispatch(addStoriesToLibrary([story]));
				} catch (error) {
					console.error('Ошибка при получении данных:', error);
				}
			}
    }),
  }),
});

export const { useFetchAllStoriesQuery, useLoadStoryByIdQuery } = storyAPI;