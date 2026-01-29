import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    withCredentials: true // Çerezlerin gönderilmesini sağlar
});

export default api;

