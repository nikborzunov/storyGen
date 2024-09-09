import { IHistory, IStory } from '@/src/typing/story';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface StoryState {
  library: IStory[];
  history: IHistory[];
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
    addStoriesToLibrary(state, action: PayloadAction<IStory[]>) {
      return {
        ...state,
        library: state.library.concat(action.payload),
      };
    },
    addHistory(state, action: PayloadAction<IHistory[]>) {
      return {
        ...state,
        history: state.history.concat(action.payload),
      };
    },
    storiesFetching(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    storiesFetchingSuccess(state, action: PayloadAction<IStory[]>) {
      return {
        ...state,
        isLoading: false,
        library: state.library.concat(action.payload),
      };
    },
    storiesFetchingError(state, action: PayloadAction<string>) {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    },
  },
});

export default storySlice.reducer;

export const { addStoriesToLibrary, addHistory, storiesFetching, storiesFetchingSuccess, storiesFetchingError } = storySlice.actions;