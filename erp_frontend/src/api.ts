import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    withCredentials: true // Çerezlerin gönderilmesini sağlar
});

// Request Interceptor: Her isteğe Token ekle
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
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
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const response = await axios.post('/api/token/refresh/', {
                        refresh: refreshToken
                    });

                    const newAccessToken = response.data.access;
                    localStorage.setItem('access_token', newAccessToken);

                    // Yeni token ile isteği tekrarla
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Token yenileme başarısız:", refreshError);
                    // Refresh token de geçersizse çıkış yap
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = "/";
                }
            } else {
                // Refresh token yoksa çıkış yap
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export default api;

