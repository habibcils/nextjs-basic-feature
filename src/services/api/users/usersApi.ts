import { apiClient } from '../axiosInstance';
import { AxiosRequestConfig } from 'axios';

export interface DummyUserItem {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  role: string;
  company: {
    name: string;
    title: string;
    department: string;
  };
}

export interface UsersResponse {
  users: DummyUserItem[];
  total: number;
  skip: number;
  limit: number;
}

export const usersApi = {
  /**
   * Hit GET https://dummyjson.com/users
   */
  getUsers: async (limit = 10, skip = 0, config?: AxiosRequestConfig): Promise<UsersResponse> => {
    const response = await apiClient.get<UsersResponse>(`/users?limit=${limit}&skip=${skip}`, config);
    return response.data;
  },

  /**
   * Hit GET https://dummyjson.com/users/search?q={query}
   */
  searchUsers: async (query: string, config?: AxiosRequestConfig): Promise<UsersResponse> => {
    const response = await apiClient.get<UsersResponse>(`/users/search?q=${encodeURIComponent(query)}`, config);
    return response.data;
  },
};

