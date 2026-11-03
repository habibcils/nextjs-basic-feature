import axios, { AxiosRequestConfig } from 'axios';

// Map untuk melacak request yang sedang berjalan agar bisa dicancel saat ganti halaman
const pendingRequests = new Map<string, AbortController>();

export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Otomatis tambahkan signal AbortController ke request
apiClient.interceptors.request.use(
  (config) => {
    // Generate key unik untuk request ini: method + url
    const requestKey = `${config.method?.toUpperCase()}_${config.url}`;

    // Buat AbortController baru jika belum ada signal dari caller
    if (!config.signal) {
      const controller = new AbortController();
      config.signal = controller.signal;
      pendingRequests.set(requestKey, controller);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Bersihkan pending request setelah selesai
apiClient.interceptors.response.use(
  (response) => {
    const requestKey = `${response.config.method?.toUpperCase()}_${response.config.url}`;
    pendingRequests.delete(requestKey);
    return response;
  },
  (error) => {
    if (error.config) {
      const requestKey = `${error.config.method?.toUpperCase()}_${error.config.url}`;
      pendingRequests.delete(requestKey);
    }
    // Jika error karena dicancel oleh user ganti page, kita tandai
    if (axios.isCancel(error)) {
      console.log('⚡ [Axios] Request dibatalkan karena perpindahan halaman:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Fungsi untuk membatalkan semua request axios yang sedang berjalan.
 * Dipanggil otomatis saat perpindahan halaman / unmount page.
 */
export const cancelAllPendingRequests = (reason = 'Navigasi ke halaman lain') => {
  if (pendingRequests.size > 0) {
    console.log(`🚫 Membatalkan ${pendingRequests.size} request axios yang masih berjalan...`);
    pendingRequests.forEach((controller) => {
      controller.abort(reason);
    });
    pendingRequests.clear();
  }
};

