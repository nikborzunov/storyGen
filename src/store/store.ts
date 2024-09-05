import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storyReducer from './reducers/StorySlice';
import settingsReducer from './reducers/SettingsSlice'
import { storyAPI } from '../services/StoryServis';

const rootReducer = combineReducers({
	story: storyReducer,
	settings: settingsReducer,
	[storyAPI.reducerPath]: storyAPI.reducer
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(storyAPI.middleware)
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];