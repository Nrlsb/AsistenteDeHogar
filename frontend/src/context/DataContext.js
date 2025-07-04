// frontend/src/context/DataContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/apiService';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const DataContext = createContext();

// CORRECCIÓN: Exportamos un hook personalizado para consumir el contexto fácilmente.
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  // Estados para cada sección
  const [tasks, setTasks] = useState([]);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [meals, setMeals] = useState({
    lunes: '', martes: '', miercoles: '', jueves: '', viernes: '', sabado: '', domingo: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.token) {
        try {
          setLoading(true);
          const [tasksData, shoppingListsData, expensesData, mealsData] = await Promise.all([
            apiService.getTasks(user.token),
            apiService.getShoppingLists(user.token),
            apiService.getExpenses(user.token),
            apiService.getMeals(user.token),
          ]);

          setTasks(tasksData);
          setShoppingLists(shoppingListsData);
          setExpenses(expensesData);
          if (mealsData) {
            setMeals(mealsData);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('Error al cargar los datos.');
        } finally {
          setLoading(false);
        }
      } else {
        setTasks([]);
        setShoppingLists([]);
        setExpenses([]);
        setMeals({ lunes: '', martes: '', miercoles: '', jueves: '', viernes: '', sabado: '', domingo: '' });
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // --- Funciones de Tareas ---
  const addTask = async (taskData) => {
    try {
      const newTask = await apiService.createTask(taskData, user.token);
      setTasks([...tasks, newTask]);
      toast.success('Tarea añadida con éxito');
    } catch (error) {
      toast.error('Error al añadir la tarea');
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const updated = await apiService.updateTask(taskId, taskData, user.token);
      setTasks(tasks.map((task) => (task._id === taskId ? updated : task)));
      toast.success('Tarea actualizada');
    } catch (error) {
      toast.error('Error al actualizar la tarea');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await apiService.deleteTask(taskId, user.token);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success('Tarea eliminada');
    } catch (error) {
      toast.error('Error al eliminar la tarea');
    }
  };

  // --- Funciones de Listas de Compras ---
  const addShoppingList = async (listName) => {
    try {
      const newList = await apiService.createShoppingList({ name: listName }, user.token);
      setShoppingLists([...shoppingLists, newList]);
      toast.success(`Lista "${listName}" creada con éxito`);
    } catch (error) {
      toast.error('Error al crear la lista de compras');
    }
  };

  const deleteShoppingList = async (listId) => {
    try {
        await apiService.deleteShoppingList(listId, user.token);
        setShoppingLists(shoppingLists.filter(list => list._id !== listId));
        toast.success('Lista de compras eliminada');
    } catch (error) {
        toast.error('Error al eliminar la lista');
    }
  };

  const shareShoppingList = async (listId, email) => {
    try {
        const updatedList = await apiService.shareShoppingList(listId, email, user.token);
        setShoppingLists(shoppingLists.map(list => list._id === listId ? updatedList : list));
        toast.success(`Lista compartida con ${email}`);
    } catch (error) {
        toast.error(error.response?.data?.message || 'Error al compartir la lista');
    }
  };

  // --- Funciones de Artículos de Compra ---
  const addShoppingItem = async (listId, itemData) => {
    try {
        const { newItem } = await apiService.addShoppingItemToList(listId, itemData, user.token);
        const updatedLists = shoppingLists.map(list => {
            if (list._id === listId) {
                return { ...list, items: [...list.items, newItem] };
            }
            return list;
        });
        setShoppingLists(updatedLists);
        toast.success('Artículo añadido');
    } catch (error) {
        toast.error('Error al añadir el artículo');
    }
  };

  const updateShoppingItem = async (listId, itemId, itemData) => {
    try {
        const { updatedItem } = await apiService.updateShoppingItemInList(listId, itemId, itemData, user.token);
        const updatedLists = shoppingLists.map(list => {
            if (list._id === listId) {
                return {
                    ...list,
                    items: list.items.map(item => item._id === itemId ? updatedItem : item)
                };
            }
            return list;
        });
        setShoppingLists(updatedLists);
        toast.success('Artículo actualizado');
    } catch (error) {
        toast.error('Error al actualizar el artículo');
    }
  };

  const deleteShoppingItem = async (listId, itemId) => {
    try {
        await apiService.deleteShoppingItemFromList(listId, itemId, user.token);
        const updatedLists = shoppingLists.map(list => {
            if (list._id === listId) {
                return { ...list, items: list.items.filter(item => item._id !== itemId) };
            }
            return list;
        });
        setShoppingLists(updatedLists);
        toast.success('Artículo eliminado');
    } catch (error) {
        toast.error('Error al eliminar el artículo');
    }
  };

  // --- Funciones de Gastos y Comidas ---
  const addExpense = async (expenseData) => {
    try {
      const newExpense = await apiService.createExpense(expenseData, user.token);
      setExpenses([...expenses, newExpense]);
      toast.success('Gasto añadido con éxito');
    } catch (error) {
      toast.error('Error al añadir el gasto');
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await apiService.deleteExpense(expenseId, user.token);
      setExpenses(expenses.filter((expense) => expense._id !== expenseId));
      toast.success('Gasto eliminado');
    } catch (error) {
      toast.error('Error al eliminar el gasto');
    }
  };

  const saveMeals = async (mealsData) => {
    try {
      const updatedMeals = await apiService.saveMeals(mealsData, user.token);
      setMeals(updatedMeals);
      toast.success('Plan de comidas guardado');
    } catch (error) {
      toast.error('Error al guardar el plan de comidas');
    }
  };

  return (
    <DataContext.Provider
      value={{
        loading,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        shoppingLists,
        addShoppingList,
        deleteShoppingList,
        shareShoppingList,
        addShoppingItem,
        updateShoppingItem,
        deleteShoppingItem,
        expenses,
        addExpense,
        deleteExpense,
        meals,
        saveMeals,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
