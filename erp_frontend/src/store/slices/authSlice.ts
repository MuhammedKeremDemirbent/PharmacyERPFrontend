import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../../config/constants';

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

            // Side effect: LocalStorage'a da yaz (Axios interceptor için)
            localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, action.payload.token);
            localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, action.payload.refreshToken);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;

            // Side effect: LocalStorage'dan sil
            localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
            localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload; // Sadece access token güncelle
            localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, action.payload);
        },
        refreshTokens: (state, action: PayloadAction<{ access: string; refresh?: string }>) => {
            state.token = action.payload.access;
            localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, action.payload.access);

            if (action.payload.refresh) {
                state.refreshToken = action.payload.refresh;
                localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, action.payload.refresh);
            }
        },
    },
});

export const { loginSuccess, logout, setAccessToken, refreshTokens } = authSlice.actions;
export default authSlice.reducer;


//Kullanıcı oturum bilgilerini yönetir.
//Login olduğunda token'ı LocalStorage'a kaydeder. Böylece httpRequest.ts bunları okuyabilir.