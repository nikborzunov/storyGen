import { selectOptions } from '@/src/constants/stories';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ISelectOption = { name: string; value: string; checked?: boolean };
export type IToggle = { name: string; title: string; checked: boolean };

export type SettingsState = {
  selectedThemes: ISelectOption[];
  toggleConfig: { [key: string]: IToggle };
};

const initialToggleConfig: { [key: string]: IToggle } = {
  darkMode: { name: 'darkMode', title: 'Темный режим', checked: true },
  storySize: { name: 'storySize', title: 'Размер истории', checked: false },
  musicOn: { name: 'musicOn', title: 'Музыка', checked: false },
  typingEffect: { name: 'typingEffect', title: 'Эффект печатания', checked: false },
  uniqueStoriesOnly: { name: 'uniqueStoriesOnly', title: 'Только уникальные истории', checked: false },
  gameMode: { name: 'gameMode', title: 'Режим игры', checked: false },
  blockScreen: { name: 'blockScreen', title: 'Блокировка экрана', checked: false },
};

const initialState: SettingsState = {
  selectedThemes: selectOptions,
  toggleConfig: { ...initialToggleConfig },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    chooseStoryTheme(state, action: PayloadAction<ISelectOption[]>) {
      const selectedNames = new Set(action.payload.map(opt => opt.name));
    
      state.selectedThemes = state.selectedThemes.map(theme => {
        if (selectedNames.has(theme.name)) {
          return { ...theme, checked: true };
        }
        return { ...theme, checked: false };
      });
    },
    changeToggleConfig(state, action: PayloadAction<IToggle>) {
      const { name, title, checked } = action.payload;

      const updatedToggleConfig = { 
        ...state.toggleConfig,
        [name]: { name, title, checked },
      };

      state.toggleConfig = updatedToggleConfig;
    },
  }
});

export default settingsSlice.reducer;

export const { chooseStoryTheme, changeToggleConfig } = settingsSlice.actions;