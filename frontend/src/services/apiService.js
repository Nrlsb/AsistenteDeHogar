import axios from 'axios';

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

// --- API Functions (Complete & Final Version) ---

// Auth
export const login = (userData) => api.post('/auth/login', userData);
export const register = (userData) => api.post('/auth/register', userData);
export const getProfile = () => api.get('/auth/profile');
export const getMe = getProfile; // Alias for compatibility

// Tasks
export const getTasks = () => api.get('/tasks');
export const createTask = (taskData) => api.post('/tasks', taskData);
export const addTask = createTask; // Proactive alias
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Shopping
export const getShoppingItems = () => api.get('/shopping');
export const getShoppingList = getShoppingItems; // Alias for compatibility
export const createShoppingItem = (itemData) => api.post('/shopping', itemData);
export const addShoppingItem = createShoppingItem; // FIX for current error
export const updateShoppingItem = (id, itemData) => api.put(`/shopping/${id}`, itemData);
export const deleteShoppingItem = (id) => api.delete(`/shopping/${id}`);

// Meal Plans
export const getMealPlans = () => api.get('/meals');
export const getMealPlan = getMealPlans; // Alias for compatibility
export const createMealPlan = (mealData) => api.post('/meals', mealData);
export const addMealPlan = createMealPlan; // Proactive alias
export const updateMealPlan = (id, mealData) => api.put(`/meals/${id}`, mealData);
export const deleteMealPlan = (id) => api.delete(`/meals/${id}`);

// Expenses
export const getExpenses = () => api.get('/expenses');
export const createExpense = (expenseData) => api.post('/expenses', expenseData);
export const addExpense = createExpense; // Proactive alias
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
