import { selectOptions } from '@/src/constants/stories';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ISelectOption = { name: string, value: string, checked?: boolean };

export type SettingsState = {
  selectedThemes: ISelectOption[];
};

const initialState: SettingsState = {
  selectedThemes: selectOptions,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    chooseStoryTheme(state, action: PayloadAction<ISelectOption[]>) {
      const updates = new Map(action.payload.map(opt => [opt.name, opt]));
      
      state.selectedThemes = state.selectedThemes.map(theme => {
        const match = updates.get(theme.name);
        if (match) {
          return { ...theme, checked: match.checked ?? theme.checked };
        }
        return theme;
      });
    }
  }
});

export default settingsSlice.reducer;

export const { chooseStoryTheme } = settingsSlice.actions;