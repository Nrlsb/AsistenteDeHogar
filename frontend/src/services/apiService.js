// frontend/src/services/apiService.js
import axios from 'axios';

const API_URL = '/api/';

// =============================================
// Funciones de Autenticación (AÑADIDAS)
// =============================================
const register = async (userData) => {
    const response = await axios.post(API_URL + 'users', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post(API_URL + 'users/login', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

// getMe no es estrictamente necesario si guardamos el usuario en localStorage,
// pero es una buena práctica para validar el token con el backend.
// La ruta /api/users/me ya existe en el backend.
const getMe = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'users/me', config);
    return response.data;
}


// =============================================
// Funciones de Listas de Compras
// =============================================
const getShoppingLists = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'shopping', config);
  return response.data;
};

const createShoppingList = async (listData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'shopping', listData, config);
  return response.data;
};

const deleteShoppingList = async (listId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + 'shopping/' + listId, config);
  return response.data;
};

const shareShoppingList = async (listId, email, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(API_URL + `shopping/${listId}/share`, { email }, config);
    return response.data;
  };

// =============================================
// Funciones de Artículos de Compra
// =============================================
const addShoppingItemToList = async (listId, itemData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + `shopping/${listId}/items`, itemData, config);
    return { listId, newItem: response.data };
};

const updateShoppingItemInList = async (listId, itemId, itemData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + `shopping/${listId}/items/${itemId}`, itemData, config);
    return { listId, updatedItem: response.data };
};

const deleteShoppingItemFromList = async (listId, itemId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(API_URL + `shopping/${listId}/items/${itemId}`, config);
    return response.data;
};

// =============================================
// Funciones de Tareas
// =============================================
const getTasks = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'tasks', config);
    return response.data;
};

const createTask = async (taskData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'tasks', taskData, config);
    return response.data;
};

const updateTask = async (taskId, taskData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + 'tasks/' + taskId, taskData, config);
    return response.data;
};

const deleteTask = async (taskId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(API_URL + 'tasks/' + taskId, config);
    return response.data;
};

// =============================================
// Funciones de Gastos
// =============================================
const getExpenses = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'expenses', config);
    return response.data;
};

const createExpense = async (expenseData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'expenses', expenseData, config);
    return response.data;
};

const deleteExpense = async (expenseId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(API_URL + 'expenses/' + expenseId, config);
    return response.data;
};

// =============================================
// Funciones de Comidas
// =============================================
const getMeals = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'meals', config);
    return response.data;
};

const saveMeals = async (mealsData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'meals', mealsData, config);
    return response.data;
};

// Exportamos todas las funciones para ser usadas en la aplicación
const apiService = {
    register,
    login,
    logout,
    getMe,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getShoppingLists,
    createShoppingList,
    deleteShoppingList,
    shareShoppingList,
    addShoppingItemToList,
    updateShoppingItemInList,
    deleteShoppingItemFromList,
    getExpenses,
    createExpense,
    deleteExpense,
    getMeals,
    saveMeals,
};

export default apiService;
