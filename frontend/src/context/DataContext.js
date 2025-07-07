// nrlsb/asistentedehogar/AsistenteDeHogar-ab8ced350d0a76f79702cd5ab21b0004078dffb3/frontend/src/context/DataContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../services/apiService';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
    const { token } = useAuth(); // Se mantiene para saber si el usuario está autenticado

    // Estados para cada sección
    const [tasks, setTasks] = useState([]);
    const [shoppingList, setShoppingList] = useState([]);
    const [meals, setMeals] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (token) {
                setLoading(true);
                try {
                    // Cargar todos los datos en paralelo cuando hay un token
                    const [tasksData, shoppingData, mealsData, expensesData] = await Promise.all([
                        api.getTasks(),
                        api.getShoppingList(),
                        api.getMeals(),
                        api.getExpenses()
                    ]);
                    setTasks(tasksData);
                    setShoppingList(shoppingData);
                    setMeals(mealsData);
                    setExpenses(expensesData);
                } catch (error) {
                    console.error('Error fetching initial data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                // Si no hay token, limpiar los datos
                setTasks([]);
                setShoppingList([]);
                setMeals([]);
                setExpenses([]);
                setLoading(false);
            }
        };

        loadData();
    }, [token]); // El efecto se ejecuta cada vez que el token cambia

    // --- FUNCIONES DE TAREAS ---
    const createTask = async (taskData) => {
        try {
            // --- CAMBIO ---
            // Se usa 'createTask' en lugar de 'addTask' y ya no se pasa el token.
            const newTask = await api.createTask(taskData);
            setTasks(prev => [...prev, newTask]);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const updateTask = async (id, taskData) => {
        try {
            const updatedTask = await api.updateTask(id, taskData);
            setTasks(prev => prev.map(t => (t._id === id ? updatedTask : t)));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.deleteTask(id);
            setTasks(prev => prev.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // --- FUNCIONES DE COMPRAS ---
    const addShoppingItem = async (itemData) => {
        try {
            const newItem = await api.addShoppingItem(itemData);
            setShoppingList(prev => [...prev, newItem]);
        } catch (error) {
            console.error('Error adding shopping item:', error);
        }
    };

    const updateShoppingItem = async (id, itemData) => {
        try {
            const updatedItem = await api.updateShoppingItem(id, itemData);
            setShoppingList(prev => prev.map(i => (i._id === id ? updatedItem : i)));
        } catch (error) {
            console.error('Error updating shopping item:', error);
        }
    };

    const deleteShoppingItem = async (id) => {
        try {
            await api.deleteShoppingItem(id);
            setShoppingList(prev => prev.filter(i => i._id !== id));
        } catch (error) {
            console.error('Error deleting shopping item:', error);
        }
    };
    
    // --- FUNCIONES DE COMIDAS ---
    const createMeal = async (mealData) => {
        try {
            const newMeal = await api.createMeal(mealData);
            setMeals(prev => [...prev, newMeal]);
        } catch (error) {
            console.error('Error creating meal:', error);
        }
    };

    const deleteMeal = async (id) => {
        try {
            await api.deleteMeal(id);
            setMeals(prev => prev.filter(m => m._id !== id));
        } catch (error) {
            console.error('Error deleting meal:', error);
        }
    };

    // --- FUNCIONES DE GASTOS ---
    const createExpense = async (expenseData) => {
        try {
            const newExpense = await api.createExpense(expenseData);
            setExpenses(prev => [...prev, newExpense]);
        } catch (error) {
            console.error('Error creating expense:', error);
        }
    };
    
    const deleteExpense = async (id) => {
        try {
            await api.deleteExpense(id);
            setExpenses(prev => prev.filter(e => e._id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };


    const value = {
        tasks,
        shoppingList,
        meals,
        expenses,
        loading,
        createTask,
        updateTask,
        deleteTask,
        addShoppingItem,
        updateShoppingItem,
        deleteShoppingItem,
        createMeal,
        deleteMeal,
        createExpense,
        deleteExpense
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
