import { apiClient } from '../axiosInstance';
import { AxiosRequestConfig } from 'axios';

export interface DummyPost {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

export interface PostsResponse {
  posts: DummyPost[];
  total: number;
  skip: number;
  limit: number;
}

export const settingsApi = {
  /**
   * Hit GET https://dummyjson.com/posts (Data log aktivitas / notifikasi sistem)
   */
  getSystemActivityLogs: async (limit = 5, config?: AxiosRequestConfig): Promise<PostsResponse> => {
    const response = await apiClient.get<PostsResponse>(`/posts?limit=${limit}`, config);
    return response.data;
  },

  /**
   * Hit PUT https://dummyjson.com/users/{id} (Update data profil pengguna di dummyjson)
   */
  updateUserProfile: async (id: number, data: Partial<{ firstName: string; lastName: string; email: string }>, config?: AxiosRequestConfig) => {
    const response = await apiClient.put(`/users/${id}`, data, config);
    return response.data;
  },
};

