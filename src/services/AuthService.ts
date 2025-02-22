import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthState, clearSuccessMessage, login, setAuthError } from '../store/reducers/AuthSlice';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { resetStoryState } from '../store/reducers/StorySlice';

WebBrowser.maybeCompleteAuthSession();

const extra = Constants.expoConfig?.extra || (Constants.manifest as any)?.extra;

type GoogleLoginRequest = { idToken: string; accessToken: string };

const baseQuery = fetchBaseQuery({ 
  baseUrl: extra?.API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
});

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: baseQuery,
  endpoints: (build) => ({
    googleLogin: build.mutation<{ accessToken: string; user: { userId: string; email: string } }, GoogleLoginRequest>({
      query: (body) => ({
        url: '/auth/google',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data: response } = await queryFulfilled;
          const { accessToken, user } = response;
          const { userId, email } = user;

          dispatch(resetStoryState());
          dispatch(login({ accessToken, userId, email }));
          dispatch(clearSuccessMessage());
          dispatch(setAuthError(''));
        } catch (error) {
          console.error('Ошибка при логине через Google:', error);
          dispatch(setAuthError('Ошибка при авторизации'));
        }
      },
    }),
    refreshToken: build.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
  }),
});

export const { useGoogleLoginMutation, useRefreshTokenMutation } = authAPI;