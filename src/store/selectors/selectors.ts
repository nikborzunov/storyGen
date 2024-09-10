import { createSelector } from 'reselect';
import { RootState } from '../store';

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