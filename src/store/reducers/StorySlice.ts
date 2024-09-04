import { IHistoryItem, IStory } from '@/src/typing/story';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface StoryState {
  library: IStory[];
  history: IHistoryItem[];
}

const initialState: StoryState = {
  library: [],
  history: []
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
    }
  }
});

export default storySlice.reducer;

export const { addStoryToLibrary, addStoryToHistory } = storySlice.actions;