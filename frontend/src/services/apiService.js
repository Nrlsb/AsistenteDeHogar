import axios from 'axios';

// La URL de la API ahora apunta a una ruta relativa.
// Netlify usará la regla del proxy en `netlify.toml` para redirigir
// estas llamadas a tu backend en Render.
const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para añadir el token de autenticación a cada solicitud.
api.interceptors.request.use(config => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const { token } = JSON.parse(userStr);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error al parsear el usuario desde localStorage", error);
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// --- Servicios de Autenticación ---
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (userData) => api.post('/auth/login', userData);

// --- Servicios de Tareas ---
export const getTasks = () => api.get('/tasks');
export const addTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// --- Servicios de Compras ---
export const getShoppingItems = () => api.get('/shopping');
export const addShoppingItem = (itemData) => api.post('/shopping', itemData);
export const updateShoppingItem = (id, itemData) => api.put(`/shopping/${id}`, itemData);
export const deleteShoppingItem = (id) => api.delete(`/shopping/${id}`);

// --- Servicios de Gastos ---
export const getExpenses = () => api.get('/expenses');
export const addExpense = (expenseData) => api.post('/expenses', expenseData);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// --- Servicios de Comidas ---
export const getMealPlans = () => api.get('/meals');
export const addMealPlan = (mealData) => api.post('/meals', mealData);
export const updateMealPlan = (id, mealData) => api.put(`/meals/${id}`, mealData);
export const deleteMealPlan = (id) => api.delete(`/meals/${id}`);

// NOTA: Se eliminó el 'export default api' para usar solo exportaciones nombradas,
// lo que previene los errores de "is not a function".

