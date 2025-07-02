import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
    getTasks, addTask as apiAddTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask 
} from '../services/apiService';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    // Aquí se añadirían los otros estados (shoppingItems, meals, etc.)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await getTasks();
            setTasks(data);
        } catch (err) {
            setError('No se pudieron cargar las tareas.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Si hay un usuario, cargamos sus tareas.
        if (user) {
            fetchTasks();
        }
    }, [user, fetchTasks]);

    const addTask = async (taskData) => {
        try {
            const { data } = await apiAddTask(taskData);
            setTasks(prevTasks => [...prevTasks, data]);
        } catch (err) {
            setError('Error al añadir la tarea.');
            console.error(err);
        }
    };

    const updateTask = async (id, taskData) => {
        try {
            const { data } = await apiUpdateTask(id, taskData);
            setTasks(prevTasks => prevTasks.map(task => (task._id === id ? data : task)));
        } catch (err) {
            setError('Error al actualizar la tarea.');
            console.error(err);
        }
    };

    const deleteTask = async (id) => {
        try {
            await apiDeleteTask(id);
            setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
        } catch (err) {
            setError('Error al eliminar la tarea.');
            console.error(err);
        }
    };

    const value = {
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        // Aquí se exportarían las otras funciones (addShoppingItem, etc.)
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    return useContext(DataContext);
};
