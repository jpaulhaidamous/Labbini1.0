import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          try {
            // Try to refresh the token
            const response = await axios.post(`${API_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            // Save new tokens
            localStorage.setItem('accessToken', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            if (typeof window !== 'undefined') {
              window.location.href = '/en/login';
            }

            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');

          if (typeof window !== 'undefined') {
            window.location.href = '/en/login';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// API helper functions
export const api = {
  get: <T = any>(url: string, config = {}) =>
    apiClient.get<T>(url, config).then(res => res.data),

  post: <T = any>(url: string, data = {}, config = {}) =>
    apiClient.post<T>(url, data, config).then(res => res.data),

  put: <T = any>(url: string, data = {}, config = {}) =>
    apiClient.put<T>(url, data, config).then(res => res.data),

  delete: <T = any>(url: string, config = {}) =>
    apiClient.delete<T>(url, config).then(res => res.data),

  patch: <T = any>(url: string, data = {}, config = {}) =>
    apiClient.patch<T>(url, data, config).then(res => res.data),
};
