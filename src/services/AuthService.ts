import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { login } from '../store/reducers/AuthSlice';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra;

type GoogleLoginRequest = { idToken: string; accessToken: string };
type RefreshTokenRequest = { refreshToken: string };

export const authAPI = createApi({
	reducerPath: 'authAPI',
	baseQuery: fetchBaseQuery({ baseUrl: extra?.API_URL }),
	endpoints: (build) => ({
		googleLogin: build.mutation<{ accessToken: string; refreshToken: string; user: { userId: string; email: string } }, GoogleLoginRequest>({
			query: (body) => ({
				url: '/auth/google',
				method: 'POST',
				body,
			}),
			async onQueryStarted(arg, { queryFulfilled, dispatch }) {
				try {
					const { data: response } = await queryFulfilled;
					const { accessToken, refreshToken } = response;
					const { userId, email } = response?.user;

					dispatch(login({ accessToken, refreshToken, userId, email }));
				} catch (error) {
					console.error('Ошибка при логине через Google:', error);
				}
			},
		}),
		refreshToken: build.mutation<{ accessToken: string }, RefreshTokenRequest>({
			query: (body) => ({
				url: '/auth/refresh',
				method: 'POST',
				body,
			}),
		}),
	}),
});

export const { useGoogleLoginMutation, useRefreshTokenMutation } = authAPI;