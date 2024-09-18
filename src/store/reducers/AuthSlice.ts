import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthState = {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    userId: string | null;
    email: string | null;
    error: string | null;
    successMessage?: string | null,
};

const initialState: AuthState = {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    userId: null,
    email: null,
    error: null,
    successMessage: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ accessToken: string; refreshToken?: string; userId?: string; email?: string }>) {
            state.isAuthenticated = true;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken || null;
            state.userId = action.payload.userId || null;
            state.email = action.payload.email || null;
            state.error = null;
            state.successMessage = null;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.accessToken = null;
            state.refreshToken = null;
            state.userId = null;
            state.email = null;
            state.error = null;
        },
        setAuthError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        clearSuccessMessage(state) {
            state.successMessage = null;
        },
    },
});

export default authSlice.reducer;

export const { login, logout, setAuthError, clearSuccessMessage } = authSlice.actions;