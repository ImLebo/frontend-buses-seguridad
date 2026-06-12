import { axiosInstance } from './axiosInstance';
import './interceptors'; // Import to guarantee interceptors are active

export const httpClient = {
  get: async <T>(url: string, params?: unknown): Promise<T> => {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  },

  post: async <T>(url: string, body?: unknown, params?: unknown): Promise<T> => {
    const response = await axiosInstance.post<T>(url, body, { params });
    return response.data;
  },

  put: async <T>(url: string, body?: unknown, params?: unknown): Promise<T> => {
    const response = await axiosInstance.put<T>(url, body, { params });
    return response.data;
  },

  patch: async <T>(url: string, body?: unknown, params?: unknown): Promise<T> => {
    const response = await axiosInstance.patch<T>(url, body, { params });
    return response.data;
  },

  delete: async <T>(url: string, params?: unknown): Promise<T> => {
    const response = await axiosInstance.delete<T>(url, { params });
    return response.data;
  },
};
