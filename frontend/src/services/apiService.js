import axios from 'axios';

// Creamos una instancia de Axios. Si la app estuviera en producción,
// la URL base sería la del backend desplegado. Gracias al proxy de Netlify,
// podemos simplemente usar una ruta relativa.
const API = axios.create({
    baseURL: '/api' 
});

// Interceptor de Axios: se ejecuta en cada petición.
// Su trabajo es tomar el token de localStorage y añadirlo a las cabeceras
// de autorización si existe. Esto automatiza el envío del token.
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});


// --- Endpoints de Autenticación ---
export const login = (userData) => API.post('/auth/login', userData);
export const register = (userData) => API.post('/auth/register', userData);
// ¡FUNCIÓN AÑADIDA! Esta es la que faltaba.
export const getMe = () => API.get('/auth/me');


// --- Endpoints de Tareas ---
export const getTasks = () => API.get('/tasks');
export const addTask = (taskData) => API.post('/tasks', taskData);
export const updateTask = (id, taskData) => API.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);


// --- Endpoints de la Lista de Compras ---
export const getShoppingItems = () => API.get('/shopping');
export const addShoppingItem = (itemData) => API.post('/shopping', itemData);
export const updateShoppingItem = (id, itemData) => API.put(`/shopping/${id}`, itemData);
export const deleteShoppingItem = (id) => API.delete(`/shopping/${id}`);


// --- Endpoints del Plan de Comidas ---
export const getMealPlan = () => API.get('/meals');
export const updateMealPlan = (planData) => API.put('/meals', planData);


// --- Endpoints de Gastos ---
export const getExpenses = () => API.get('/expenses');
export const addExpense = (expenseData) => API.post('/expenses', expenseData);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
