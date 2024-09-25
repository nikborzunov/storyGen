import { IHistory, IStory } from '@/src/typing/story';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface StoryState {
  library: IStory[];
  history: IHistory[];
  isLoading: boolean;
  error: string | null;
  isAudioPlaying: boolean | null;
}

const initialState: StoryState = {
  library: [],
  history: [],
  isLoading: false,
  error: null,
  isAudioPlaying: null,
};

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    addStoriesToLibrary(state, action: PayloadAction<IStory[]>) {
      action.payload.forEach(story => {
        if (!state.library.some(existingStory => existingStory.storyId === story.storyId)) {
          state.library.push(story);
        };
      });
    },
    addHistory(state, action: PayloadAction<IHistory[]>) {
      action.payload.forEach((item) => {
        if (!state.history.some(historyItem => historyItem.storyId === item.storyId)) {
          state.history.push(item);
        }
      });
    },
    resetStoryState(state) {
      state.library = [];
      state.history = [];
      state.isLoading = false;
      state.error = null;
      state.isAudioPlaying = null;
    },
    storiesFetching(state) {
      state.isLoading = true;
    },
    storiesFetchingSuccess(state, action: PayloadAction<IStory[]>) {
      action.payload.forEach(story => {
        if (!state.library.some(existingStory => existingStory?.storyId === story.storyId)) {
          state.library.push(story);
        };
      });
      state.isLoading = false;
    },
    storiesFetchingError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setAudioPlayingState(state, action: PayloadAction<boolean | null>) {
      state.isAudioPlaying = action.payload;
    },
  },
});

export default storySlice.reducer;

export const {
  addStoriesToLibrary,
  addHistory,
  resetStoryState,
  storiesFetching,
  storiesFetchingSuccess,
  storiesFetchingError,
  setAudioPlayingState,
} = storySlice.actions;

export const selectStoryState = (state: RootState) => state.story;