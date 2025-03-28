import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IHistory, IStory } from '../typing/story';
import { addHistory, addStoriesToLibrary} from '../store/reducers/StorySlice';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { AuthState } from '../store/reducers/AuthSlice';

WebBrowser.maybeCompleteAuthSession();

const extra = Constants.expoConfig?.extra || (Constants.manifest as any)?.extra;

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
	audioUrl: string;
};

interface HistoryResponse {
	data: {
			history: IHistory[];
	};
}

const baseQuery = fetchBaseQuery({ 
	baseUrl: extra?.API_URL,
	prepareHeaders: (headers, { getState }) => {
			const state = getState() as { auth: AuthState };
			const token = state.auth?.accessToken;

			if (token) {
					headers.set('Authorization', `Bearer ${token}`);
			}

			return headers;
	}
});

export const storyAPI = createApi({
	reducerPath: 'storyAPI',
	baseQuery: baseQuery,
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
					const { data: response } = await queryFulfilled;

					const stories = response?.data?.stories;
					const history = response?.data?.history;

					dispatch(addStoriesToLibrary(stories));
					dispatch(addHistory(history));

				} catch (error) {
					console.error('Ошибка при получении данных:', error);
				}
			}
		}),
		loadStoryById: build.query<{ data: IStoryLoadByIdResponse }, string>({
      query: (storyId) => `/story/load?storyId=${storyId}`,
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
				try {
					const { data: response } = await queryFulfilled;

					const story = response?.data
					dispatch(addStoriesToLibrary([story]));
				} catch (error) {
					console.error('Ошибка при получении данных:', error);
				}
			}
    }),
		fetchHistoryByUserId: build.query<HistoryResponse, string>({
      query: (userId) => `/history?userId=${userId}`,
			async onQueryStarted(arg, { queryFulfilled, dispatch }) {
				try {
					const { data: response } = await queryFulfilled;

					const history = response?.data?.history
					
					dispatch(addHistory(history));
				} catch (error) {
					console.error('Ошибка при получении данных:', error);
				}
			}
    }),
  }),
});

export const { useFetchAllStoriesQuery, useLoadStoryByIdQuery, useFetchHistoryByUserIdQuery} = storyAPI;