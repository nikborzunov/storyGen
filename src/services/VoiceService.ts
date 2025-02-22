import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Voice } from '../typing/voice';
import Constants from 'expo-constants';
import { addVoice } from '../store/reducers/VoiceLibrarySlice';
import { RootState } from '../store/store';
import { AuthState } from '../store/reducers/AuthSlice';

interface ExtraConfig {
    API_URL?: string;
}

const extra: ExtraConfig = Constants.expoConfig?.extra || (Constants.manifest as any)?.extra;

const baseQuery = fetchBaseQuery({ 
	baseUrl: extra?.API_URL,
	prepareHeaders: (headers, { getState }) => {
			const state = getState() as { auth: AuthState };
			const token = state.auth?.accessToken;
            headers.set('Content-Type', 'multipart/form-data');

			if (token) {
					headers.set('Authorization', `Bearer ${token}`);
			}

			return headers;
	}
});

export const voiceAPI = createApi({
    reducerPath: 'voiceAPI',
    baseQuery: baseQuery,
    endpoints: (build) => ({
			addVoice: build.mutation<Voice, FormData>({
				query: (formData) => {

                    // const parts = formData['_parts']; // Извлекаем внутренний массив _parts
                    // parts.forEach(part => {
                    //     console.log(`Key: ${part[0]}, Value:`, part[1]);
                    // });                  
                    
                    return {
                        url: '/voice',
                        method: 'POST',
                        body: formData,
                    };
				},
				async onQueryStarted(arg, { queryFulfilled, dispatch }) {
						try {
								const { data } = await queryFulfilled;
								dispatch(addVoice(data));
						} catch (error) {
								console.error('Ошибка при добавлении голоса VoiceService:', error);
						}
				},
		}),
        fetchVoices: build.query<Voice[], void>({
            query: () => '/voice',
            // Опционально: можно добавить кэширование
            // providesTags: (result) => 
            //     result ? 
            //     [...result.map(({ id }) => ({ type: 'Voice', id } as const)), { type: 'Voice', id: 'LIST' }] 
            //     : [{ type: 'Voice', id: 'LIST' }],
        }),
        deleteVoice: build.mutation<void, string>({
            query: (id) => ({
                url: `/voice/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                const patchResult = dispatch(
                    voiceAPI.util.updateQueryData('fetchVoices', undefined, (draft) => {
                        // Локально снятие удаленного голоса
                        return draft.filter((voice) => voice.id !== arg);
                    })
                );
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.error('Ошибка при удалении голоса:', error);
                    patchResult.undo(); // Возврат к старым данным в случае ошибки
                }
            },
        }),
    }),
});

export const { useAddVoiceMutation, useFetchVoicesQuery, useDeleteVoiceMutation } = voiceAPI;

export type VoiceApi = typeof voiceAPI;