const API_URL = process.env.REACT_APP_API_URL || '/api';

const apiService = {
    request: async (endpoint, method = 'GET', body = null) => {
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = { method, headers };
        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            if (!response.ok) {
                if (response.status === 401) {
                   localStorage.removeItem('token');
                   window.location.reload();
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Algo salió mal');
            }
            if (response.status === 204 || response.headers.get("content-length") === "0") {
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error(`Error en la petición a ${endpoint}:`, error);
            throw error;
        }
    },

    // Auth
    login: (credentials) => apiService.request('/auth/login', 'POST', credentials),
    register: (credentials) => apiService.request('/auth/register', 'POST', credentials),

    // Tasks
    getTasks: () => apiService.request('/tasks'),
    createTask: (task) => apiService.request('/tasks', 'POST', task),
    updateTask: (id) => apiService.request(`/tasks/${id}`, 'PUT'),
    deleteTask: (id) => apiService.request(`/tasks/${id}`, 'DELETE'),

    // Shopping
    getShoppingCategories: () => apiService.request('/shopping/categories'),
    createShoppingCategory: (category) => apiService.request('/shopping/categories', 'POST', category),
    deleteShoppingCategory: (id) => apiService.request(`/shopping/categories/${id}`, 'DELETE'),
    getShoppingItems: () => apiService.request('/shopping/items'),
    createShoppingItem: (item) => apiService.request('/shopping/items', 'POST', item),
    updateShoppingItem: (id) => apiService.request(`/shopping/items/${id}`, 'PUT'),
    clearPurchasedItems: () => apiService.request('/shopping/items/purchased', 'DELETE'),

    // Expenses
    getExpenses: () => apiService.request('/expenses'),
    createExpense: (expense) => apiService.request('/expenses', 'POST', expense),
    deleteExpense: (id) => apiService.request(`/expenses/${id}`, 'DELETE'),

    // Meals
    getMealPlan: () => apiService.request('/meals'),
    updateMealPlan: (plan) => apiService.request('/meals', 'PUT', plan),
};

export default apiService;
