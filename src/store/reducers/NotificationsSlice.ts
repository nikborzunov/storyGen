import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type NotificationState = {
  message: string | null;
  type: 'success' | 'error' | null;
};

const initialState: NotificationState = {
  message: null,
  type: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notifySuccess(state, action: PayloadAction<string>) {
      state.message = action.payload;
      state.type = 'success';
    },
    notifyError(state, action: PayloadAction<string>) {
      state.message = action.payload;
      state.type = 'error';
    },
    clearNotification(state) {
      state.message = null;
      state.type = null;
    },
  },
});

export const { notifySuccess, notifyError, clearNotification } = notificationSlice.actions;

export default notificationSlice.reducer;