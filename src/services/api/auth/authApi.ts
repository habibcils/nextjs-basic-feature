import { apiClient } from '../axiosInstance';
import { AxiosRequestConfig } from 'axios';

export interface DummyLoginPayload {
  username: string; // contoh: 'emilys'
  password: string; // contoh: 'emilyspass'
  expiresInMins?: number;
}

export interface DummyAuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  /**
   * Hit POST https://dummyjson.com/auth/login
   */
  login: async (payload: DummyLoginPayload, config?: AxiosRequestConfig): Promise<DummyAuthUser> => {
    const response = await apiClient.post<DummyAuthUser>('/auth/login', payload, config);
    return response.data;
  },

  /**
   * Hit GET https://dummyjson.com/auth/me
   */
  getCurrentUser: async (token: string, config?: AxiosRequestConfig): Promise<DummyAuthUser> => {
    const response = await apiClient.get<DummyAuthUser>('/auth/me', {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

