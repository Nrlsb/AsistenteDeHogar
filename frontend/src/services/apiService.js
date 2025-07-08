import axios from 'axios';

// This now directly uses the environment variable.
// If the variable is not set, it will cause an error, which is better
// than failing silently by using a wrong URL.
const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  throw new Error("Missing REACT_APP_API_URL environment variable. Please set it in your .env file or hosting provider.");
}

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.error("Could not parse user from localStorage", e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (userData) => api.post('/auth/login', userData);
export const register = (userData) => api.post('/auth/register', userData);
export const getProfile = () => api.get('/auth/profile');

export const getTasks = () => api.get('/tasks');
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export const getShoppingItems = () => api.get('/shopping');
export const createShoppingItem = (itemData) => api.post('/shopping', itemData);
export const updateShoppingItem = (id, itemData) => api.put(`/shopping/${id}`, itemData);
export const deleteShoppingItem = (id) => api.delete(`/shopping/${id}`);

// Add other API functions as needed...
