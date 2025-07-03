import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../services/apiService';
import { useAuth } from './AuthContext';

const defaultDataContext = {
    tasks: [],
    loadingTasks: false,
    addTask: () => {},
    updateTask: () => {},
    deleteTask: () => {},
    shoppingItems: [],
    loadingShopping: false,
    addShoppingItem: () => {},
    updateShoppingItem: () => {},
    deleteShoppingItem: () => {},
    mealPlan: null, // Cambiado de `meals` a `mealPlan`
    loadingMeals: false,
    updateSingleMeal: () => {}, // Nueva función para actualizar una comida
    expenses: [],
    loadingExpenses: false,
    addExpense: () => {},
    deleteExpense: () => {},
    error: null,
};

const DataContext = createContext(defaultDataContext);

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [shoppingItems, setShoppingItems] = useState([]);
    const [mealPlan, setMealPlan] = useState(null); // Estado para el plan de comidas
    const [expenses, setExpenses] = useState([]);

    const [loading, setLoading] = useState({ tasks: false, shopping: false, meals: false, expenses: false });
    const [error, setError] = useState(null);

    // --- Lógica de Tareas ---
    const fetchTasks = useCallback(async () => {
        if (!user) return;
        setLoading(prev => ({ ...prev, tasks: true }));
        try {
            const { data } = await api.getTasks();
            setTasks(data);
        } catch (err) { setError('No se pudieron cargar las tareas.'); } 
        finally { setLoading(prev => ({ ...prev, tasks: false })); }
    }, [user]);

    const addTask = async (taskData) => {
        try {
            const { data } = await api.addTask(taskData);
            setTasks(prev => [...prev, data]);
        } catch (err) { setError('Error al añadir la tarea.'); }
    };
    const updateTask = async (id, taskData) => {
        try {
            const { data } = await api.updateTask(id, taskData);
            setTasks(prev => prev.map(t => (t._id === id ? data : t)));
        } catch (err) { setError('Error al actualizar la tarea.'); }
    };
    const deleteTask = async (id) => {
        try {
            await api.deleteTask(id);
            setTasks(prev => prev.filter(t => t._id !== id));
        } catch (err) { setError('Error al eliminar la tarea.'); }
    };

    // --- Lógica de Compras ---
    const fetchShoppingItems = useCallback(async () => {
        if (!user) return;
        setLoading(prev => ({ ...prev, shopping: true }));
        try {
            const { data } = await api.getShoppingItems();
            setShoppingItems(data);
        } catch (err) { setError('No se pudieron cargar los artículos de compra.'); }
        finally { setLoading(prev => ({ ...prev, shopping: false })); }
    }, [user]);

    const addShoppingItem = async (itemData) => {
        try {
            const { data } = await api.addShoppingItem(itemData);
            setShoppingItems(prev => [...prev, data]);
        } catch (err) { setError('Error al añadir el artículo.'); }
    };
    const updateShoppingItem = async (id, itemData) => {
        try {
            const { data } = await api.updateShoppingItem(id, itemData);
            setShoppingItems(prev => prev.map(i => (i._id === id ? data : i)));
        } catch (err) { setError('Error al actualizar el artículo.'); }
    };
    const deleteShoppingItem = async (id) => {
        try {
            await api.deleteShoppingItem(id);
            setShoppingItems(prev => prev.filter(i => i._id !== id));
        } catch (err) { setError('Error al eliminar el artículo.'); }
    };

    // --- Lógica de Comidas (CORREGIDA) ---
    const fetchMealPlan = useCallback(async () => {
        if (!user) return;
        setLoading(prev => ({ ...prev, meals: true }));
        try {
            const { data } = await api.getMealPlan();
            setMealPlan(data);
        } catch (err) { 
            setError('No se pudo cargar el plan de comidas.');
            console.error(err);
        }
        finally { setLoading(prev => ({ ...prev, meals: false })); }
    }, [user]);

    const updateSingleMeal = async (day, mealType, value) => {
        if (!mealPlan) return;
        
        // Creamos una nueva copia del plan para no mutar el estado directamente
        const newMealPlan = { ...mealPlan, [day]: { ...mealPlan[day], [mealType]: value }};

        try {
            // Actualizamos el estado local inmediatamente para una UI más rápida
            setMealPlan(newMealPlan); 
            // Enviamos la actualización completa al backend
            await api.updateMealPlan(newMealPlan);
        } catch (err) {
            setError('Error al actualizar la comida.');
            console.error(err);
            // Si falla, podríamos revertir al estado anterior
            fetchMealPlan();
        }
    };

    // --- Lógica de Gastos ---
    const fetchExpenses = useCallback(async () => {
        if (!user) return;
        setLoading(prev => ({ ...prev, expenses: true }));
        try {
            const { data } = await api.getExpenses();
            setExpenses(data);
        } catch (err) { setError('No se pudieron cargar los gastos.'); }
        finally { setLoading(prev => ({ ...prev, expenses: false })); }
    }, [user]);

    const addExpense = async (expenseData) => {
        try {
            const { data } = await api.addExpense(expenseData);
            setExpenses(prev => [...prev, data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) { setError('Error al añadir el gasto.'); }
    };
    const deleteExpense = async (id) => {
        try {
            await api.deleteExpense(id);
            setExpenses(prev => prev.filter(e => e._id !== id));
        } catch (err) { setError('Error al eliminar el gasto.'); }
    };

    // Efecto para cargar todos los datos cuando el usuario inicia sesión
    useEffect(() => {
        if (user) {
            fetchTasks();
            fetchShoppingItems();
            fetchMealPlan();
            fetchExpenses();
        }
    }, [user, fetchTasks, fetchShoppingItems, fetchMealPlan, fetchExpenses]);

    const value = {
        tasks, loadingTasks: loading.tasks, addTask, updateTask, deleteTask,
        shoppingItems, loadingShopping: loading.shopping, addShoppingItem, updateShoppingItem, deleteShoppingItem,
        mealPlan, loadingMeals: loading.meals, updateSingleMeal,
        expenses, loadingExpenses: loading.expenses, addExpense, deleteExpense,
        error,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    return useContext(DataContext);
};
