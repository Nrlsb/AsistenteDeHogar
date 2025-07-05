import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/apiService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const defaultDataContext = {
    // Estados y funciones existentes...
    tasks: [],
    loadingTasks: false,
    addTask: () => {},
    updateTask: () => {},
    deleteTask: () => {},
    mealPlan: null,
    loadingMeals: false,
    updateSingleMeal: () => {},
    expenses: [],
    loadingExpenses: false,
    addExpense: () => {},
    deleteExpense: () => {},
    
    // --- NUEVA LÓGICA PARA LISTAS DE COMPRAS ---
    shoppingLists: [],
    loadingShopping: false,
    addShoppingList: () => {},
    deleteShoppingList: () => {},
    addShoppingItem: () => {},
    updateShoppingItem: () => {},
    deleteShoppingItem: () => {},

    error: null,
    modalState: { isOpen: false, title: '', message: '', onConfirm: () => {} },
    closeModal: () => {},
    handleConfirm: () => {},
};

export const DataContext = createContext(defaultDataContext);

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    // Estados existentes
    const [tasks, setTasks] = useState([]);
    const [mealPlan, setMealPlan] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState({ tasks: false, shopping: false, meals: false, expenses: false });
    const [error, setError] = useState(null);
    
    // --- NUEVO ESTADO PARA LISTAS DE COMPRAS ---
    const [shoppingLists, setShoppingLists] = useState([]);

    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const closeModal = () => setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    const handleConfirm = async () => {
        try {
            if (typeof modalState.onConfirm === 'function') {
                await modalState.onConfirm();
            }
        } catch (err) {
            console.error("Error durante la acción de confirmación:", err);
            toast.error(err.response?.data?.message || "Ocurrió un error inesperado.");
        } finally {
            closeModal();
        }
    };

    // --- LÓGICA DE TAREAS (Sin cambios) ---
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
            toast.success('¡Tarea añadida!');
        } catch (err) { toast.error(err.response?.data?.message || 'Error al añadir la tarea.'); }
    };
    const updateTask = async (id, taskData) => {
        try {
            const { data } = await api.updateTask(id, taskData);
            setTasks(prev => prev.map(t => (t._id === id ? data : t)));
        } catch (err) { toast.error(err.response?.data?.message || 'Error al actualizar la tarea.'); }
    };
    const deleteTask = (id) => {
        setModalState({
            isOpen: true,
            title: 'Eliminar Tarea',
            message: '¿Estás seguro?',
            onConfirm: async () => {
                await api.deleteTask(id);
                setTasks(prev => prev.filter(t => t._id !== id));
                toast.info('Tarea eliminada.');
            }
        });
    };

    // --- NUEVA LÓGICA PARA LISTAS DE COMPRAS ---
    const fetchShoppingLists = useCallback(async () => {
        if (!user) return;
        setLoading(prev => ({ ...prev, shopping: true }));
        try {
            const { data } = await api.getShoppingLists();
            setShoppingLists(data);
        } catch (err) { setError('No se pudieron cargar las listas de compras.'); }
        finally { setLoading(prev => ({ ...prev, shopping: false })); }
    }, [user]);

    const addShoppingList = async (listData) => {
        try {
            const { data } = await api.addShoppingList(listData);
            setShoppingLists(prev => [...prev, data]);
            toast.success(`Lista "${data.name}" creada.`);
        } catch (err) { toast.error(err.response?.data?.message || 'Error al crear la lista.'); }
    };

    const deleteShoppingList = (listId) => {
        setModalState({
            isOpen: true,
            title: 'Eliminar Lista',
            message: '¿Seguro que quieres eliminar esta lista y todos sus artículos?',
            onConfirm: async () => {
                await api.deleteShoppingList(listId);
                setShoppingLists(prev => prev.filter(l => l._id !== listId));
                toast.info('Lista eliminada.');
            }
        });
    };

    const addShoppingItem = async (listId, itemData) => {
        try {
            const { data } = await api.addShoppingItem(listId, itemData);
            setShoppingLists(prev => prev.map(list => list._id === listId ? data : list));
            toast.success('Artículo añadido.');
        } catch (err) { toast.error(err.response?.data?.message || 'Error al añadir el artículo.'); }
    };
    
    const updateShoppingItem = async (listId, itemId, itemData) => {
        try {
            const { data } = await api.updateShoppingItem(listId, itemId, itemData);
            setShoppingLists(prev => prev.map(list => list._id === listId ? data : list));
        } catch (err) { toast.error(err.response?.data?.message || 'Error al actualizar el artículo.'); }
    };

    const deleteShoppingItem = async (listId, itemId) => {
        try {
            const { data } = await api.deleteShoppingItem(listId, itemId);
            setShoppingLists(prev => prev.map(list => list._id === listId ? data : list));
            toast.info('Artículo eliminado.');
        } catch (err) { toast.error(err.response?.data?.message || 'Error al eliminar el artículo.'); }
    };


    // --- LÓGICA DE GASTOS Y COMIDAS (Sin cambios) ---
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
            setExpenses(prev => [...prev, data].sort((a, b) => new Date(b.date) - new Date(a.date)));
            toast.success('¡Gasto añadido!');
        } catch (err) { toast.error(err.response?.data?.message || 'Error al añadir el gasto.'); }
    };
    const deleteExpense = (id) => {
        setModalState({
            isOpen: true,
            title: 'Eliminar Gasto',
            message: '¿Estás seguro?',
            onConfirm: async () => {
                await api.deleteExpense(id);
                setExpenses(prev => prev.filter(e => e._id !== id));
                toast.info('Gasto eliminado.');
            }
        });
    };
    const fetchMealPlan = useCallback(async () => { /* ... */ }, [user]);
    const updateSingleMeal = async (day, mealType, value) => { /* ... */ };


    useEffect(() => {
        if (user) {
            fetchTasks();
            fetchShoppingLists();
            fetchMealPlan();
            fetchExpenses();
        }
    }, [user, fetchTasks, fetchShoppingLists, fetchMealPlan, fetchExpenses]);

    const value = {
        tasks, loadingTasks: loading.tasks, addTask, updateTask, deleteTask,
        shoppingLists, loadingShopping: loading.shopping, addShoppingList, deleteShoppingList, addShoppingItem, updateShoppingItem, deleteShoppingItem,
        mealPlan, loadingMeals: loading.meals, updateSingleMeal,
        expenses, loadingExpenses: loading.expenses, addExpense, deleteExpense,
        error,
        modalState,
        closeModal,
        handleConfirm
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    return useContext(DataContext);
};
