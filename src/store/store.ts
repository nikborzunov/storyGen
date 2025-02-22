import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storyReducer from './reducers/StorySlice';
import settingsReducer from './reducers/SettingsSlice';
import authReducer from './reducers/AuthSlice';
import voiceLibraryReducer from './reducers/VoiceLibrarySlice';
import { storyAPI } from '../services/StoryService';
import { authAPI } from '../services/AuthService';
import { voiceAPI } from '../services/VoiceService';

const rootReducer = combineReducers({
	story: storyReducer,
	settings: settingsReducer,
	auth: authReducer,
	voiceLibrary: voiceLibraryReducer,
	[storyAPI.reducerPath]: storyAPI.reducer,
	[authAPI.reducerPath]: authAPI.reducer,
	[voiceAPI.reducerPath]: voiceAPI.reducer,
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(storyAPI.middleware, authAPI.middleware, voiceAPI.middleware ),
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];