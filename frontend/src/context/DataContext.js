import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../services/apiService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [shoppingItems, setShoppingItems] = useState([]);
    const [mealPlan, setMealPlan] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState({ tasks: false, shopping: false, meals: false, expenses: false });
    const [error, setError] = useState(null);

    // Estado para manejar el modal de confirmación
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const closeModal = () => setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    const handleConfirm = async () => {
        // Ejecuta la acción de confirmación y luego cierra el modal
        await modalState.onConfirm();
        closeModal();
    };

    // --- Lógica de Tareas ---
    const fetchTasks = useCallback(async () => { /* ...sin cambios... */ }, [user]);
    const addTask = async (taskData) => { /* ...sin cambios... */ };
    const updateTask = async (id, taskData) => { /* ...sin cambios... */ };
    const deleteTask = (id) => {
        setModalState({
            isOpen: true,
            title: 'Eliminar Tarea',
            message: '¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.',
            onConfirm: async () => {
                try {
                    await api.deleteTask(id);
                    setTasks(prev => prev.filter(t => t._id !== id));
                    toast.info('Tarea eliminada.');
                } catch (err) {
                    toast.error('Error al eliminar la tarea.');
                }
            }
        });
    };

    // --- Lógica de Compras ---
    const fetchShoppingItems = useCallback(async () => { /* ...sin cambios... */ }, [user]);
    const addShoppingItem = async (itemData) => { /* ...sin cambios... */ };
    const updateShoppingItem = async (id, itemData) => { /* ...sin cambios... */ };
    const deleteShoppingItem = (id) => {
        setModalState({
            isOpen: true,
            title: 'Eliminar Artículo',
            message: '¿Estás seguro de que deseas eliminar este artículo de la lista? Esta acción no se puede deshacer.',
            onConfirm: async () => {
                try {
                    await api.deleteShoppingItem(id);
                    setShoppingItems(prev => prev.filter(i => i._id !== id));
                    toast.info('Artículo eliminado.');
                } catch (err) {
                    toast.error('Error al eliminar el artículo.');
                }
            }
        });
    };

    // --- Lógica de Comidas ---
    const fetchMealPlan = useCallback(async () => { /* ...sin cambios... */ }, [user]);
    const updateSingleMeal = async (day, mealType, value) => { /* ...sin cambios... */ };

    // --- Lógica de Gastos ---
    const fetchExpenses = useCallback(async () => { /* ...sin cambios... */ }, [user]);
    const addExpense = async (expenseData) => { /* ...sin cambios... */ };
    const deleteExpense = (id) => {
        setModalState({
            isOpen: true,
            title: 'Eliminar Gasto',
            message: '¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer.',
            onConfirm: async () => {
                try {
                    await api.deleteExpense(id);
                    setExpenses(prev => prev.filter(e => e._id !== id));
                    toast.info('Gasto eliminado.');
                } catch (err) {
                    toast.error('Error al eliminar el gasto.');
                }
            }
        });
    };

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
        // Exponemos el estado y las funciones del modal
        modalState,
        closeModal,
        handleConfirm
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    return useContext(DataContext);
};
