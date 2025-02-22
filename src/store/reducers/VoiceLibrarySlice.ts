import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Voice, VoiceLibraryState } from '@/src/typing/voice';


const initialState: VoiceLibraryState = {
    voices: [],
};

export const VoiceLibrarySlice = createSlice({
    name: 'voiceLibrary',
    initialState,
    reducers: {
        addVoice(state, action: PayloadAction<Voice>) {
          console.log({ payload: action.payload }, 'from VoiceLibrarySlice');
            state.voices.push(action.payload);
        },
    },
});

export default VoiceLibrarySlice.reducer;

export const { addVoice } = VoiceLibrarySlice.actions;

export const selectVoices = (state: RootState) => state.voiceLibrary.voices;