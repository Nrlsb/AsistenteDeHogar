import axios from 'axios';

const API = axios.create({
    baseURL: '/api' 
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

const apiService = {
    // --- Endpoints de Autenticación ---
    login: (userData) => API.post('/auth/login', userData),
    register: (userData) => API.post('/auth/register', userData),
    getMe: () => API.get('/auth/me'),

    // --- Endpoints de Tareas ---
    getTasks: () => API.get('/tasks'),
    addTask: (taskData) => API.post('/tasks', taskData),
    updateTask: (id, taskData) => API.put(`/tasks/${id}`, taskData),
    deleteTask: (id) => API.delete(`/tasks/${id}`),

    // --- Endpoints de la Lista de Compras ---
    getShoppingItems: () => API.get('/shopping'),
    addShoppingItem: (itemData) => API.post('/shopping', itemData),
    updateShoppingItem: (id, itemData) => API.put(`/shopping/${id}`, itemData),
    deleteShoppingItem: (id) => API.delete(`/shopping/${id}`),

    // --- Endpoints del Plan de Comidas ---
    getMealPlan: () => API.get('/meals'),
    updateMealPlan: (planData) => API.put('/meals', planData),

    // --- Endpoints de Gastos ---
    getExpenses: () => API.get('/expenses'),
    addExpense: (expenseData) => API.post('/expenses', expenseData),
    deleteExpense: (id) => API.delete(`/expenses/${id}`),
};

export default apiService;
