import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../services/apiService'; // Importamos todas las funciones de la API
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    // Estados para cada tipo de dato
    const [tasks, setTasks] = useState([]);
    const [shoppingItems, setShoppingItems] = useState([]);
    const [meals, setMeals] = useState([]);
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

    // --- Lógica de Comidas ---
     const fetchMeals = useCallback(async () => {
        if (!user) return;
        setLoading(prev => ({ ...prev, meals: true }));
        try {
            const { data } = await api.getMealPlans();
            setMeals(data);
        } catch (err) { setError('No se pudieron cargar los planes de comida.'); }
        finally { setLoading(prev => ({ ...prev, meals: false })); }
    }, [user]);

    const addMealPlan = async (mealData) => {
        try {
            const { data } = await api.addMealPlan(mealData);
            setMeals(prev => [...prev, data]);
        } catch (err) { setError('Error al añadir el plan de comida.'); }
    };
    const deleteMealPlan = async (id) => {
        try {
            await api.deleteMealPlan(id);
            setMeals(prev => prev.filter(m => m._id !== id));
        } catch (err) { setError('Error al eliminar el plan de comida.'); }
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
            setExpenses(prev => [...prev, data]);
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
            fetchMeals();
            fetchExpenses();
        }
    }, [user, fetchTasks, fetchShoppingItems, fetchMeals, fetchExpenses]);

    const value = {
        tasks, loadingTasks: loading.tasks, addTask, updateTask, deleteTask,
        shoppingItems, loadingShopping: loading.shopping, addShoppingItem, updateShoppingItem, deleteShoppingItem,
        meals, loadingMeals: loading.meals, addMealPlan, deleteMealPlan,
        expenses, loadingExpenses: loading.expenses, addExpense, deleteExpense,
        error,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    return useContext(DataContext);
};
