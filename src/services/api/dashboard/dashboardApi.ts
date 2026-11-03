import { apiClient } from '../axiosInstance';
import { AxiosRequestConfig } from 'axios';

export interface ProductItem {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
}

export interface ProductsResponse {
  products: ProductItem[];
  total: number;
  skip: number;
  limit: number;
}

export const dashboardApi = {
  /**
   * Hit GET https://dummyjson.com/products (Data ringkasan produk & stok untuk dashboard)
   */
  getProductsSummary: async (limit = 5, config?: AxiosRequestConfig): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(`/products?limit=${limit}`, config);
    return response.data;
  },

  /**
   * Hit GET https://dummyjson.com/carts (Data transaksi & order untuk widget grafik)
   */
  getCartsSummary: async (config?: AxiosRequestConfig) => {
    const response = await apiClient.get('/carts?limit=5', config);
    return response.data;
  },
};

