import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { axiosInstance } from './axiosInstance';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const getToken = (): string | null => {
  return (
    sessionStorage.getItem('token') ??
    localStorage.getItem('token') ??
    localStorage.getItem('authToken')
  );
};

// Request interceptor to automatically add the bearer token
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response interceptor to handle data extraction and global error wrapping
const responseSuccessInterceptor = (response: AxiosResponse) => {
  return response;
};

const responseErrorInterceptor = (error: AxiosError<{ message?: string; error?: string }>) => {
  const status = error.response?.status ?? 500;
  const payload = error.response?.data;

  const message =
    payload?.message ??
    payload?.error ??
    error.message ??
    'Ocurrió un error al procesar la solicitud.';

  return Promise.reject(new ApiError(message, status));
};

export const setupInterceptors = () => {
  axiosInstance.interceptors.request.use(requestInterceptor, (err) => Promise.reject(err));
  axiosInstance.interceptors.response.use(
    responseSuccessInterceptor,
    responseErrorInterceptor,
  );
};

// Initialize immediately
setupInterceptors();
