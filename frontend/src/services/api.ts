import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getFromStorage, setToStorage } from '@/utils';
import { ApiResponse, AuthTokens } from '@/types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiService {
  private api: AxiosInstance;
  private refreshTokenPromise: Promise<AuthTokens> | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const tokens = await this.refreshTokens();
            this.setTokens(tokens);
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    return getFromStorage('accessToken', null);
  }

  private getRefreshToken(): string | null {
    return getFromStorage('refreshToken', null);
  }

  private setTokens(tokens: AuthTokens) {
    setToStorage('accessToken', tokens.accessToken);
    setToStorage('refreshToken', tokens.refreshToken);
  }

  private clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private async refreshTokens(): Promise<AuthTokens> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshTokenPromise = this.api.post('/auth/refresh', { refreshToken })
      .then(response => response.data.data)
      .finally(() => {
        this.refreshTokenPromise = null;
      });

    return this.refreshTokenPromise;
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url, config);
    return response.data.data!;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data, config);
    return response.data.data!;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, data, config);
    return response.data.data!;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.patch(url, data, config);
    return response.data.data!;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(url, config);
    return response.data.data!;
  }

  // File upload method
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data.data!;
  }

  // Batch request method
  async batch<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    const results = await Promise.allSettled(requests.map(request => request()));
    
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Request ${index} failed:`, result.reason);
        return null as T;
      }
    }).filter(Boolean) as T[];
  }
}

export const apiService = new ApiService();