// nrlsb/asistentedehogar/AsistenteDeHogar-ab8ced350d0a76f79702cd5ab21b0004078dffb3/frontend/src/context/DataContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../services/apiService';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
    const { token } = useAuth();

    // Estados para cada sección
    const [tasks, setTasks] = useState([]);
    const [shoppingList, setShoppingList] = useState([]);
    // MEJORA: El estado del plan de comidas se inicializa como null para un mejor control
    const [mealPlan, setMealPlan] = useState(null);
    const [expenses, setExpenses] = useState([]);
    
    // MEJORA: Estados de carga y error más granulares
    const [loading, setLoading] = useState({
        tasks: true,
        shopping: true,
        meals: true,
        expenses: true
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            if (token) {
                try {
                    // Cargar todos los datos en paralelo cuando hay un token
                    setLoading({ tasks: true, shopping: true, meals: true, expenses: true });
                    const [tasksData, shoppingData, mealsData, expensesData] = await Promise.all([
                        api.getTasks().catch(err => {
                            console.error('Error fetching tasks:', err);
                            setError('Error al cargar tareas.');
                            return [];
                        }),
                        api.getShoppingList().catch(err => {
                            console.error('Error fetching shopping list:', err);
                            setError('Error al cargar la lista de compras.');
                            return [];
                        }),
                        api.getMealPlan().catch(err => {
                            console.error('Error fetching meal plan:', err);
                            setError('Error al cargar el plan de comidas.');
                            return null;
                        }),
                        api.getExpenses().catch(err => {
                            console.error('Error fetching expenses:', err);
                            setError('Error al cargar los gastos.');
                            return [];
                        })
                    ]);
                    setTasks(tasksData);
                    setShoppingList(shoppingData);
                    setMealPlan(mealsData);
                    setExpenses(expensesData);
                } catch (error) {
                    console.error('Error fetching initial data:', error);
                    setError('Ocurrió un error al cargar los datos.');
                } finally {
                    setLoading({ tasks: false, shopping: false, meals: false, expenses: false });
                }
            } else {
                // Si no hay token, limpiar los datos y estados
                setTasks([]);
                setShoppingList([]);
                setMealPlan(null);
                setExpenses([]);
                setLoading({ tasks: false, shopping: false, meals: false, expenses: false });
            }
        };

        loadData();
    }, [token]);

    // --- FUNCIONES DE TAREAS ---
    const createTask = async (taskData) => {
        try {
            const newTask = await api.createTask(taskData);
            setTasks(prev => [...prev, newTask]);
        } catch (error) {
            console.error('Error creating task:', error);
            setError('No se pudo crear la tarea.');
        }
    };

    const updateTask = async (id, taskData) => {
        try {
            const updatedTask = await api.updateTask(id, taskData);
            setTasks(prev => prev.map(t => (t._id === id ? updatedTask : t)));
        } catch (error) {
            console.error('Error updating task:', error);
            setError('No se pudo actualizar la tarea.');
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.deleteTask(id);
            setTasks(prev => prev.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
            setError('No se pudo eliminar la tarea.');
        }
    };

    // --- FUNCIONES DE COMPRAS ---
    const addShoppingItem = async (itemData) => {
        try {
            const newItem = await api.addShoppingItem(itemData);
            setShoppingList(prev => [...prev, newItem]);
        } catch (error) {
            console.error('Error adding shopping item:', error);
            setError('No se pudo añadir el artículo.');
        }
    };

    const updateShoppingItem = async (id, itemData) => {
        try {
            const updatedItem = await api.updateShoppingItem(id, itemData);
            setShoppingList(prev => prev.map(i => (i._id === id ? updatedItem : i)));
        } catch (error) {
            console.error('Error updating shopping item:', error);
            setError('No se pudo actualizar el artículo.');
        }
    };

    const deleteShoppingItem = async (id) => {
        try {
            await api.deleteShoppingItem(id);
            setShoppingList(prev => prev.filter(i => i._id !== id));
        } catch (error) {
            console.error('Error deleting shopping item:', error);
            setError('No se pudo eliminar el artículo.');
        }
    };
    
    // CORRECCIÓN: Se implementa la lógica para actualizar una comida individual
    const updateSingleMeal = async (day, mealType, description) => {
        if (!mealPlan) return;

        // Crear una copia profunda del plan actual para evitar mutaciones directas
        const newMealPlan = JSON.parse(JSON.stringify(mealPlan));
        
        // Actualizar el campo específico
        if (!newMealPlan[day]) {
            newMealPlan[day] = {};
        }
        newMealPlan[day][mealType] = description;

        try {
            // Enviar el plan completo actualizado al backend
            const updatedPlan = await api.updateMealPlan(newMealPlan);
            setMealPlan(updatedPlan);
        } catch (error) {
            console.error('Error updating meal plan:', error);
            setError('No se pudo actualizar el plan de comidas.');
        }
    };

    // --- FUNCIONES DE GASTOS ---
    const addExpense = async (expenseData) => {
        try {
            const newExpense = await api.createExpense(expenseData);
            setExpenses(prev => [...prev, newExpense]);
        } catch (error) {
            console.error('Error creating expense:', error);
            setError('No se pudo añadir el gasto.');
        }
    };
    
    const deleteExpense = async (id) => {
        try {
            await api.deleteExpense(id);
            setExpenses(prev => prev.filter(e => e._id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
            setError('No se pudo eliminar el gasto.');
        }
    };


    const value = {
        tasks,
        shoppingList,
        mealPlan,
        expenses,
        loading,
        error,
        setError,
        createTask,
        updateTask,
        deleteTask,
        addShoppingItem,
        updateShoppingItem,
        deleteShoppingItem,
        updateSingleMeal, // CORRECCIÓN: Se exporta la función correcta
        addExpense,
        deleteExpense
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
