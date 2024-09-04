import { IStory } from '@/src/typing/story';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type StoryState = {
	library: IStory[]
};

const initialState: StoryState = {
	library: []
};

export const storySlice = createSlice({
	name: 'story',
	initialState,
	reducers: {
		addStoryToStore(state, action: PayloadAction<IStory>) {
			state.library = [...state.library, action.payload];
		}
	}
});

export default storySlice.reducer;