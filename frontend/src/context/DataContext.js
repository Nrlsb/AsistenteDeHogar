import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../services/apiService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

// Objeto con el estado por defecto para el contexto.
// Esto previene que la aplicación se rompa si un componente
// intenta acceder al contexto antes de que esté disponible.
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
    mealPlan: null,
    loadingMeals: false,
    updateSingleMeal: () => {},
    expenses: [],
    loadingExpenses: false,
    addExpense: () => {},
    deleteExpense: () => {},
    error: null,
    modalState: { isOpen: false, title: '', message: '', onConfirm: () => {} },
    closeModal: () => {},
    handleConfirm: () => {},
};

// Creamos el contexto con el estado por defecto
const DataContext = createContext(defaultDataContext);

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [shoppingItems, setShoppingItems] = useState([]);
    const [mealPlan, setMealPlan] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState({ tasks: false, shopping: false, meals: false, expenses: false });
    const [error, setError] = useState(null);

    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const closeModal = () => setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    const handleConfirm = async () => {
        await modalState.onConfirm();
        closeModal();
    };

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
            toast.success('¡Tarea añadida con éxito!');
        } catch (err) { 
            toast.error('Error al añadir la tarea.');
        }
    };
    const updateTask = async (id, taskData) => {
        try {
            const { data } = await api.updateTask(id, taskData);
            setTasks(prev => prev.map(t => (t._id === id ? data : t)));
            if (taskData.description) {
                toast.success('Tarea actualizada.');
            }
        } catch (err) { 
            toast.error('Error al actualizar la tarea.');
        }
    };

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
            toast.success('¡Artículo añadido a la lista!');
        } catch (err) { 
            toast.error('Error al añadir el artículo.');
        }
    };

    const updateShoppingItem = async (id, itemData) => {
        try {
            const { data } = await api.updateShoppingItem(id, itemData);
            setShoppingItems(prev => prev.map(i => (i._id === id ? data : i)));
            if (itemData.name) {
                toast.success('Artículo actualizado.');
            }
        } catch (err) { 
            toast.error('Error al actualizar el artículo.');
        }
    };

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
        const newMealPlan = { ...mealPlan, [day]: { ...mealPlan[day], [mealType]: value }};
        try {
            setMealPlan(newMealPlan); 
            await api.updateMealPlan(newMealPlan);
            toast.success('Plan de comidas actualizado.');
        } catch (err) {
            toast.error('Error al actualizar la comida.');
            console.error(err);
            fetchMealPlan();
        }
    };

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
            toast.success('¡Gasto añadido con éxito!');
        } catch (err) { 
            toast.error('Error al añadir el gasto.');
        }
    };

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
        modalState,
        closeModal,
        handleConfirm
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData debe ser usado dentro de un DataProvider');
    }
    return context;
};
