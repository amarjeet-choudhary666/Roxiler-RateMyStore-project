import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/v1/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/users/login', credentials),
  
  register: (userData: {
    name: string;
    email: string;
    password: string;
    address: string;
  }) => api.post('/users/signup', userData),
  
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (userData: any) => api.put('/users/profile', userData),
  
  updatePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => api.put('/users/update-password', passwordData),
};

export const adminAPI = {
  register: (userData: {
    name: string;
    email: string;
    password: string;
    address: string;
  }) => api.post('/admin/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post('/admin/login', credentials),
  
  getDashboard: () => api.get('/admin/dashboard'),
  
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  
  createUser: (userData: {
    name: string;
    email: string;
    password: string;
    address: string;
    role: string;
  }) => api.post('/admin/users', userData),
  
  updateUserRole: (userId: string, role: string) =>
    api.put(`/admin/users/${userId}/role`, { role }),
  
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
};

export const storeOwnerAPI = {
  register: (userData: {
    name: string;
    email: string;
    password: string;
    address: string;
  }) => api.post('/storeowner/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post('/storeowner/login', credentials),
  
  getProfile: () => api.get('/storeowner/profile'),
  
  updateProfile: (userData: { name?: string; address?: string }) =>
    api.put('/storeowner/profile', userData),
};

export const storeAPI = {
  getAllStores: (params?: any) => {
    return api.get('/stores/all', { params });
  },
  
  getStoreById: (storeId: string) => api.get(`/stores/${storeId}`),
  
  searchStores: (params: { query: string; page?: number; limit?: number }) =>
    api.get('/stores/search', { params }),
  
  createStore: (storeData: {
    name: string;
    email: string;
    address: string;
    ownerId: string;
  }) => api.post('/stores/create', storeData),
  
  updateStore: (storeId: string, storeData: any) =>
    api.put(`/stores/${storeId}`, storeData),
  
  deleteStore: (storeId: string) => api.delete(`/stores/${storeId}`),
  
  getOwnerDashboard: () => api.get('/stores/dashboard/owner'),
};

export const ratingAPI = {
  submitRating: (ratingData: { storeId: string; rating: number }) =>
    api.post('/ratings/submit', ratingData),
  
  updateRating: (ratingId: string, rating: number) =>
    api.put(`/ratings/${ratingId}`, { rating }),
  
  getUserRatings: () => api.get('/ratings/my-ratings'),
  
  getUserStoreRating: (storeId: string) =>
    api.get(`/ratings/store/${storeId}/my-rating`),
  
  getStoreRatings: () => api.get('/ratings/my-store'),
};

export default api;
