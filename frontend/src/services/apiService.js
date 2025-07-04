// frontend/src/services/apiService.js
import axios from 'axios';

// La URL base de tu API. Si usas el proxy de Netlify, esta es la ruta correcta.
const API_URL = '/api/';

// =============================================
// Funciones de Listas de Compras (NUEVO)
// =============================================

// Obtener todas las listas de compras (propias y compartidas)
const getShoppingLists = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'shopping', config);
  return response.data;
};

// Crear una nueva lista de compras
const createShoppingList = async (listData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'shopping', listData, config);
  return response.data;
};

// Eliminar una lista de compras
const deleteShoppingList = async (listId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + 'shopping/' + listId, config);
  return response.data;
};

// Compartir una lista de compras con otro usuario
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
// Funciones de Artículos de Compra (dentro de una lista - NUEVO)
// =============================================

// Añadir un artículo a una lista específica
const addShoppingItemToList = async (listId, itemData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL + `shopping/${listId}/items`, itemData, config);
    return { listId, newItem: response.data }; // Devolvemos el ID de la lista para saber dónde añadirlo
};

// Actualizar un artículo en una lista específica
const updateShoppingItemInList = async (listId, itemId, itemData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + `shopping/${listId}/items/${itemId}`, itemData, config);
    return { listId, updatedItem: response.data };
};

// Eliminar un artículo de una lista específica
const deleteShoppingItemFromList = async (listId, itemId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(API_URL + `shopping/${listId}/items/${itemId}`, config);
    return response.data; // El backend devuelve { listId, itemId }
};


// =============================================
// Funciones de Tareas (Sin cambios)
// =============================================
const getTasks = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'tasks', config);
    return response.data;
};

const createTask = async (taskData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL + 'tasks', taskData, config);
    return response.data;
};

const updateTask = async (taskId, taskData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + 'tasks/' + taskId, taskData, config);
    return response.data;
};

const deleteTask = async (taskId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(API_URL + 'tasks/' + taskId, config);
    return response.data;
};

// =============================================
// Funciones de Gastos (Sin cambios)
// =============================================
const getExpenses = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'expenses', config);
    return response.data;
};

const createExpense = async (expenseData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL + 'expenses', expenseData, config);
    return response.data;
};

const deleteExpense = async (expenseId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(API_URL + 'expenses/' + expenseId, config);
    return response.data;
};

// =============================================
// Funciones de Comidas (Sin cambios)
// =============================================
const getMeals = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'meals', config);
    return response.data;
};

const saveMeals = async (mealsData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL + 'meals', mealsData, config);
    return response.data;
};


const apiService = {
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
