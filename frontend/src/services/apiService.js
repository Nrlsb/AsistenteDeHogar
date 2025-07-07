// nrlsb/asistentedehogar/AsistenteDeHogar-ab8ced350d0a76f79702cd5ab21b0004078dffb3/frontend/src/services/apiService.js
import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
});

// Interceptor que añade el token de autorización a cada solicitud
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- FUNCIONES DE AUTENTICACIÓN ---
export const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    return data;
};

export const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    return data;
};

export const getMe = async () => {
    const { data } = await API.get('/auth/me');
    return data;
};

// --- FUNCIONES DE TAREAS (TASKS) ---
export const getTasks = async () => {
    const { data } = await API.get('/tasks');
    return data;
};

export const createTask = async (taskData) => {
    const { data } = await API.post('/tasks', taskData);
    return data;
};

export const updateTask = async (id, taskData) => {
    const { data } = await API.put(`/tasks/${id}`, taskData);
    return data;
};

export const deleteTask = async (id) => {
    const { data } = await API.delete(`/tasks/${id}`);
    return data;
};

// --- FUNCIONES DE LISTA DE COMPRAS (SHOPPING) ---
export const getShoppingList = async () => {
    const { data } = await API.get('/shopping');
    return data;
};

export const addShoppingItem = async (itemData) => {
    const { data } = await API.post('/shopping', itemData);
    return data;
};

export const updateShoppingItem = async (id, itemData) => {
    const { data } = await API.put(`/shopping/${id}`, itemData);
    return data;
};

export const deleteShoppingItem = async (id) => {
    const { data } = await API.delete(`/shopping/${id}`);
    return data;
};

// --- FUNCIONES DE PLAN DE COMIDAS (MEALS) ---
// CORRECCIÓN: Se renombra getMeals a getMealPlan para mayor claridad.
export const getMealPlan = async () => {
    const { data } = await API.get('/meals');
    return data;
};

// CORRECCIÓN: Se reemplazan las funciones de comidas individuales por una que actualiza el plan completo.
export const updateMealPlan = async (mealPlanData) => {
    const { data } = await API.put(`/meals`, mealPlanData);
    return data;
};

// --- FUNCIONES DE GASTOS (EXPENSES) ---
export const getExpenses = async () => {
    const { data } = await API.get('/expenses');
    return data;
};

// CORRECCIÓN: Se renombra addExpense a createExpense por consistencia.
export const createExpense = async (expenseData) => {
    const { data } = await API.post('/expenses', expenseData);
    return data;
};

export const deleteExpense = async (id) => {
    const { data } = await API.delete(`/expenses/${id}`);
    return data;
};
