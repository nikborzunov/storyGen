import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storyReducer from './reducers/StorySlice';
import settingsReducer from './reducers/SettingsSlice';
import authReducer from './reducers/AuthSlice';
import { storyAPI } from '../services/StoryService';
import { authAPI } from '../services/AuthService';

const rootReducer = combineReducers({
	story: storyReducer,
	settings: settingsReducer,
	auth: authReducer,
	[storyAPI.reducerPath]: storyAPI.reducer,
	[authAPI.reducerPath]: authAPI.reducer,
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(storyAPI.middleware, authAPI.middleware),
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];