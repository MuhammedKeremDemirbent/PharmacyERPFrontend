import api from '../api';
import type { User } from '../types';

interface LoginResponse {
    access: string;
    refresh: string;
    user: User; // Backend kullanıcı bilgisini dönüyorsa
    // Dönmüyorsa, token decode edilmeli
}

export const authService = {
    login: async (username: string, password: string) => {
        const response = await api.post<LoginResponse>('/token/', { username, password });
        return response.data;
    },

    // Logout genelde client-side (token silme) yapılır ama backend'e de bildirilebilir
    logout: async () => {
        // Backend'de blacklist endpoint'i varsa:
        // await api.post('/token/blacklist/', { refresh_token });
    }
};
