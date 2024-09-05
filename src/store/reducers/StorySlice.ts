import { IHistoryItem, IStory } from '@/src/typing/story';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface StoryState {
  library: IStory[];
  history: IHistoryItem[];
	isLoading: boolean;
	error: string;
}

const initialState: StoryState = {
  library: [],
  history: [],
	isLoading: false,
	error: '',
};

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    addStoryToLibrary(state, action: PayloadAction<IStory>) {
      const isAlreadyExists = state.library.some(story => story.title === action.payload.title);
			
      if (!isAlreadyExists) {
        state.library.push(action.payload);
      }
    },
    addStoryToHistory(state, action: PayloadAction<string>) {
      const isAlreadyExists = state.history.some(historyItem => historyItem.name === action.payload);
      if (!isAlreadyExists && action.payload?.length) {
        const length = state.history.length + 1;
        state.history.push({ name: action.payload, value: String(length) });
      }
    },
		storiesFetching(state) {
			state.isLoading = true;
		},
		storiesFetchingSuccess(state, action: PayloadAction<IStory>) {

			const isAlreadyExists = state.history.some(historyItem => historyItem.name === action.payload.title);

			state.isLoading = false;
			state.error = '';
			if (!isAlreadyExists && action.payload?.title.length) {
        const length = state.history.length + 1;
        state.history.push({ name: action.payload?.title, value: String(length) });
				state.library.push(action.payload);
      }
		},
		storiesFetchingError(state, action: PayloadAction<string>) {
			state.isLoading = false;
			state.error = action.payload;
		},
  }
});

export default storySlice.reducer;

export const { addStoryToLibrary, addStoryToHistory, storiesFetching, storiesFetchingSuccess, storiesFetchingError } = storySlice.actions;