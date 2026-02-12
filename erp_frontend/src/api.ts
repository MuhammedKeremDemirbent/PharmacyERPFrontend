import axios from 'axios';
import { store } from './store/store';
import { setAccessToken, logout } from './store/slices/authSlice';
import { jwtDecode } from 'jwt-decode';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

const api = axios.create({
    baseURL: '/api',
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    withCredentials: true // Çerezlerin gönderilmesini sağlar
});

// Helper: Token süresi dolmasına 1 dakika (60sn) kaldı mı?
const isTokenExpired = (token: string): boolean => {
    try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        // Eğer tokenın bitmesine 60 saniyeden az kaldıysa "süresi dolmuş" sayalım ki yenileyelim
        return decoded.exp < currentTime + 60;
    } catch (error) {
        return true; // Bozuksa süresi dolmuş varsay
    }
};

// Request Interceptor: Her isteğe Token ekle ve gerekirse yenile
api.interceptors.request.use(
    async (config) => {
        // Eğer istek zaten refresh endpoint'ine ise, araya girme
        if (config.url?.includes('token/refresh')) {
            return config;
        }

        let token = store.getState().auth.token;

        if (token && isTokenExpired(token)) {
            // Token süresi dolmak üzere! Mutex ile kilitleyip yenileyelim.
            if (!mutex.isLocked()) {
                const release = await mutex.acquire();
                try {
                    // Yenileme işlemi
                    const refreshToken = store.getState().auth.refreshToken;
                    if (refreshToken) {
                        const response = await axios.post('/api/token/refresh/', {
                            refresh: refreshToken
                        });
                        const newAccessToken = response.data.access;

                        // Redux'ı güncelle
                        store.dispatch(setAccessToken(newAccessToken));

                        // Token'ı güncelle ki bu istek yeni token ile gitsin
                        token = newAccessToken;
                    } else {
                        // Refresh token yoksa çıkış yap
                        const error = new axios.Cancel("Session expired");
                        // Logout işlemi catch bloğunda veya finally'de yapılabilir ama burada temiz kalsın
                        throw error;
                    }
                } catch (error) {
                    store.dispatch(logout());
                    window.location.href = "/login";
                    throw error;
                } finally {
                    release();
                }
            } else {
                // Eğer başkası kilitlediyse, o bitirene kadar bekle
                await mutex.waitForUnlock();
                // O bitince güncel token'ı Redux'tan al
                token = store.getState().auth.token;
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: 401 Hatası (Token Süresi Dolduysa)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Login isteği (token alma) sırasında 401 gelirse araya girme, Login.tsx kendi halletsin.
        if (originalRequest.url.includes('/token/') && !originalRequest.url.includes('/refresh/')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = store.getState().auth.refreshToken; // Redux'tan oku

            if (refreshToken) {
                try {
                    const response = await axios.post('/api/token/refresh/', {
                        refresh: refreshToken
                    });

                    const newAccessToken = response.data.access;

                    // Yeni token'ı Redux'a kaydet
                    store.dispatch(setAccessToken(newAccessToken));

                    // Yeni token ile isteği tekrarla
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Token yenileme başarısız:", refreshError);
                    store.dispatch(logout());
                    window.location.href = "/login";
                }
            } else {
                store.dispatch(logout());
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;

