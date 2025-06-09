import axios from 'axios';
// https://backend-exp-1.onrender.com
// https://exciting-spice-armadillo.glitch.me
const API_BASE_URL = 'https://backend-exp-1.onrender.com';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global error responses
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      console.error('API Error Response:', error.response.status, error.response.data);

      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      } else if (error.response.status === 404) {
        console.error('Resource not found');
      } else if (error.response.status >= 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

// Category related API calls
export const categoryService = {
  getCategories: async (userId) => {
    try {
      const response = await api.get(`/categories/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getProductsByCategory: async (category, userId) => {
    try {
      const response = await api.get(`/products`, {
        params: { category, user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  addCategory: async (categoryData) => {
    try {
      const response = await api.post('/addshopcategory', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

 


  updateCategory: async (categoryId, updateData) => {
    try {
      const response = await api.put(`/updateCategory/${categoryId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (categoryId, userId) => {
    try {
      const response = await api.delete(`/deleteCategories/${parseInt(categoryId)}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  getAllCategoriesAndProducts: async (userId) => {
    try {
      const response = await api.get(`/getCategoriesAndProducts/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories and products:', error);
      throw error;
    }
  }
};

// Product related API calls
export const productService = {
  addProduct: async (productData) => {
    try {
      const response = await api.post('/addproduct', productData);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (productId, updateData) => {
    try {
      const response = await api.put(`/updateproduct/${productId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (productId, userId) => {
    try {
      const response = await api.delete(`/deleteProducts/${parseInt(productId)}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

// Expense related API calls
export const expenseService = {
  getExpenseCost: async (userId) => {
    try {
      const response = await api.get(`/getExpenseCost/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense cost:', error);
      throw error;
    }
  },

  getYearWiseExpenseData: async (userId, year) => {
    try {
      const response = await api.get(`/getYearWiseExpenceData/${userId}/${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching year wise expense data:', error);
      throw error;
    }
  },

  addExpense: async (expenseData) => {
    try {
      const response = await api.post('/postExpenseData', expenseData);
      return response.data;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  },

  updateExpense: async (expenseId, updateData) => {
    try {
      const response = await api.put(`/updateExpense/${expenseId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  deleteExpense: async (expenseId, userId) => {
    try {
      const response = await api.delete(`/deleteExpence/${parseInt(expenseId)}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }
};

// Source/Income related API calls
export const sourceService = {
  getSourceData: async (userId, month, year) => {
    try {
      const response = await api.get(`/getSource/${userId}/${month}/${year}`);
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching source data:', error);
      throw error;
    }
  },

  getYearWiseData: async (userId, year) => {
    try {
      const response = await api.get(`/getYearWiseData/${userId}/${year}`);
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching year wise data:', error);
      throw error;
    }
  },

  getAllSourceData: async (userId) => {
    try {
      const response = await api.get(`/getSourceData/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all source data:', error);
      throw error;
    }
  },

  getReportSourceData: async (userId) => {
    try {
      const response = await api.get(`/getReportSource/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report source data:', error);
      throw error;
    }
  },

  addSource: async (sourceData) => {
    try {
      const response = await api.post('/addSource', sourceData);
      return response.data;
    } catch (error) {
      console.error('Error adding source:', error);
      throw error;
    }
  },

     updateSource: async (sourceId, updateData) => {
    try {
      const response = await api.put(`/updateSource/${sourceId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating source:', error);
      throw error;
    }
  },

  deleteSource: async (sourceId, userId) => {
    try {
      const response = await api.delete(`/deleteSource/${parseInt(sourceId)}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting source:', error);
      throw error;
    }
  }
};

// Savings related API calls
export const savingsService = {
  getSavingData: async (userId, month, year) => {
    try {
      const response = await api.get(`/getSavings/${userId}/${month}/${year}`);
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching savings data:', error);
      throw error;
    }
  },

  getYearWiseSavingsData: async (userId, year) => {
    try {
      const response = await api.get(`/getYearWiseSavingsData/${userId}/${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching year wise savings data:', error);
      throw error;
    }
  },

  addSaving: async (savingData) => {
    try {
      const response = await api.post('/addSaving', savingData);
      return response.data;
    } catch (error) {
      console.error('Error adding saving:', error);
      throw error;
    }
  }
};

// Auth related API calls
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  getProfilePicture: async (userId) => {
    try {
      const response = await api.get(`/getPhoto/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching photo:', error);
      throw error;
    }
  },

    uploadProfilePicture: async (profileData) => {
    try {
      const response = await api.post('/uploadProfilePicture', profileData);
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  verifyToken: async (token) => {
    try {
      const response = await api.post('/verify-token', { token });
      return response.data;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  }
};

// Export all services
export default {
  categoryService,
  productService,
  expenseService,
  sourceService,
  savingsService,
  authService,
  api
};
