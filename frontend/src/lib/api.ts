import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5030/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('phatphap_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => api.post('/auth/register', { name, email, password }),
  me: () => api.get('/auth/me'),
};

export const quizApi = {
  getAll: (params?: Record<string, string>) => api.get('/quizzes', { params }),
  getById: (id: number) => api.get(`/quizzes/${id}`),
};

export const resultApi = {
  submit: (data: { quiz_id: number; score: number; correct_answers: number; total_questions: number; time_spent: number }) =>
    api.post('/results', data),
  getMine: () => api.get('/results/me'),
  getStats: () => api.get('/results/stats/me'),
};

export const leaderboardApi = {
  getAll: () => api.get('/leaderboard'),
  getWeekly: () => api.get('/leaderboard/weekly'),
};

export const badgeApi = {
  getAll: () => api.get('/badges'),
  getMine: () => api.get('/badges/me'),
};

export const topicApi = {
  getAll: () => api.get('/topics'),
  getById: (id: number) => api.get(`/topics/${id}`),
};

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: { name: string; avatar?: string }) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users'),
};

export default api;
