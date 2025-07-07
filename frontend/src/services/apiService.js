// nrlsb/asistentedehogar/AsistenteDeHogar-ab8ced350d0a76f79702cd5ab21b0004078dffb3/frontend/src/services/apiService.js
import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
});

// --- CAMBIO PRINCIPAL ---
// Se añade un interceptor de solicitudes de Axios.
// Esta función se ejecutará ANTES de cada llamada a la API.
// Automáticamente tomará el token del localStorage y lo añadirá
// a los encabezados de autorización.
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Si existe un token, lo adjuntamos a la cabecera de la solicitud
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    // Manejar errores de la solicitud
    return Promise.reject(error);
});


// --- FUNCIONES DE API SIMPLIFICADAS ---
// Ahora ninguna de las funciones necesita que se le pase el 'token' como argumento.
// El interceptor se encarga de todo.

// Auth
export const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    // Guardamos el token aquí para que el interceptor lo pueda usar en las siguientes peticiones
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    return data;
};

export const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    // Guardamos el token aquí también
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    return data;
};

export const getMe = async () => {
    const { data } = await API.get('/auth/me');
    return data;
};

// Tasks
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

// Shopping List
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

// ... Aquí irían el resto de tus llamadas a la API (Meals, Expenses)
// todas ellas se benefician del interceptor y no necesitan el argumento 'token'.
