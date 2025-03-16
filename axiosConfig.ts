// axiosConfig.ts
import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { useCookie } from '#app';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.cbm3lla.me';
console.log('Base URL:', baseURL);

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true, // Se envían las cookies en cada solicitud
});

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
}

// Interceptor de requests: incluye el token en el header
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Leer el token desde la cookie
    const accessTokenCookie = useCookie('access_token');
    const accessToken = accessTokenCookie.value;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Interceptor de respuestas: maneja errores 401 y refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Leer el refresh token desde la cookie
        const refreshTokenCookie = useCookie('refresh_token');
        const refreshToken = refreshTokenCookie.value;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Solicitar nuevo access token
        const response = await axios.post(`${baseURL}auth/refresh`, null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
          withCredentials: true,
        });

        const { access_token, refresh_token } = response.data;

        // Actualizar las cookies con los nuevos tokens
        const accessTokenCookie = useCookie('access_token', {
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        const refreshTokenCookie2 = useCookie('refresh_token', {
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        accessTokenCookie.value = access_token;
        refreshTokenCookie2.value = refresh_token;

        processQueue(null, access_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        const accessTokenCookie = useCookie('access_token');
        const refreshTokenCookie = useCookie('refresh_token');
        accessTokenCookie.value = null;
        refreshTokenCookie.value = null;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
