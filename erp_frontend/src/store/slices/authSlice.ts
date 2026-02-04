import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: string | null;
    token: string | null;
    refreshToken: string | null; // Refresh token ekledik
    isAuthenticated: boolean;
}

// Redux Persist zaten saklıyor, manuel okumaya ve yazmaya gerek yok
const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ user: string; token: string; refreshToken: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken; // State'e kaydet
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload; // Sadece access token güncelle
        },
    },
});

export const { loginSuccess, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
