import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('zenith_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('zenith_token');
            localStorage.removeItem('zenith_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ========== AUTH ==========
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// ========== TASKS ==========
export const tasksAPI = {
    getAll: (params) => api.get('/tasks', { params }),
    getById: (id) => api.get(`/tasks/${id}`),
    create: (data) => api.post('/tasks', data),
    update: (id, data) => api.put(`/tasks/${id}`, data),
    delete: (id) => api.delete(`/tasks/${id}`),
};

// ========== SCHEDULE ==========
export const scheduleAPI = {
    getAll: (params) => api.get('/schedule', { params }),
    create: (data) => api.post('/schedule/block', data),
    update: (id, data) => api.put(`/schedule/${id}`, data),
    delete: (id) => api.delete(`/schedule/${id}`),
};

// ========== ANALYTICS ==========
export const analyticsAPI = {
    getProgress: (period) => api.get('/analytics/progress', { params: { period } }),
    getKPIs: () => api.get('/analytics/kpis'),
    getTrends: () => api.get('/analytics/trends'),
};

export default api;
