import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../services/apiService';
import { AuthContext } from './AuthContext'; // FIX: Corrected import

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        try {
          const [tasksData, shoppingData, mealsData, expensesData] = await Promise.all([
            api.getTasks(),
            api.getShoppingList(),
            api.getMealPlan(),
            api.getExpenses(),
          ]);
          setTasks(tasksData.data);
          setShoppingList(shoppingData.data);
          setMealPlan(mealsData.data);
          setExpenses(expensesData.data);
        } catch (error) {
          console.error('Failed to fetch data', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Clear data on logout
        setTasks([]);
        setShoppingList([]);
        setMealPlan([]);
        setExpenses([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Provide state and functions to update state
  const value = {
    tasks,
    setTasks,
    shoppingList,
    setShoppingList,
    mealPlan,
    setMealPlan,
    expenses,
    setExpenses,
    loading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
