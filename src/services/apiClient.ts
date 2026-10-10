import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { PaginatedResponse, PaginationParams } from '@/types/api';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('california_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('california_token');
      localStorage.removeItem('california_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper for paginated requests that captures X-Total-Count header
export async function fetchPaginated<T>(
  url: string,
  params?: PaginationParams
): Promise<PaginatedResponse<T>> {
  const pageNumber = params?.pageNumber || 1;
  const pageSize = params?.pageSize || 10;

  const response = await apiClient.get<T[]>(url, {
    params: {
      pageNumber,
      pageSize,
      orderBy: params?.orderBy,
      desc: params?.desc,
    },
  });

  const totalCountHeader = response.headers['x-total-count'];
  const totalCount = totalCountHeader ? parseInt(totalCountHeader, 10) : response.data.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return {
    data: response.data || [],
    totalCount,
    pageNumber,
    pageSize,
    totalPages,
  };
}
