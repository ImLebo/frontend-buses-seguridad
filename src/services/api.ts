import axios, { AxiosError, type Method } from 'axios';

const API_BASE_URL = 'http://localhost:8181';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const getToken = (): string | null => {
  return sessionStorage.getItem('token') ?? localStorage.getItem('token') ?? localStorage.getItem('authToken');
};

type RequestConfig = {
  method?: Method;
  body?: unknown;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const apiRequest = async <T>(path: string, config: RequestConfig = {}): Promise<T> => {
  try {
    const response = await apiClient.request<T>({
      url: path,
      method: config.method ?? 'GET',
      data: config.body,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const status = axiosError.response?.status ?? 500;
    const payload = axiosError.response?.data;

    const message =
      payload?.message ??
      payload?.error ??
      axiosError.message ??
      'Ocurrio un error al consumir el servicio.';

    throw new ApiError(message, status);
  }
};
