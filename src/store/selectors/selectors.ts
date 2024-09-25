import { createSelector } from 'reselect';
import { RootState } from '../store';
import { selectStoryState } from '../reducers/StorySlice';

export const getHistoryOptions = createSelector(
  (state: RootState) => state.story.history,
  (history) => {
    return history.map(item => ({
      value: item?.storyId,
      name: item?.title,
    }));
  }
);

export const getSelectedThemes = createSelector(
  (state: RootState) => state.settings?.selectedThemes,
  (selectedThemes) => {
    return selectedThemes.map(theme => ({
      name: theme?.name,
      value: theme?.value,
      checked: theme?.checked,
    }));
  }
);

export const selectLibrary = createSelector(
  [selectStoryState],
  (storyState) => storyState.library
);

export const selectHistory = createSelector(
  [selectStoryState],
  (storyState) => storyState.history
);

export const selectIsLoading = createSelector(
  [selectStoryState],
  (storyState) => storyState.isLoading
);

export const selectError = createSelector(
  [selectStoryState],
  (storyState) => storyState.error
);

export const selectIsAudioPlaying = createSelector(
  [selectStoryState],
  (storyState) => storyState.isAudioPlaying
);

export const selectToggleConfig = (state: RootState) => state.settings.toggleConfig;

export const selectTypingModeAndDarkMode = createSelector([selectToggleConfig], (config) => {
  return {
    isTypingMode: config?.typingEffect?.checked ?? false,
    isDarkMode: config?.darkMode?.checked ?? false,
  };
});
