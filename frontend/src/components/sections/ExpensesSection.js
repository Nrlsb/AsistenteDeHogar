import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

// Definimos las categorías de gastos disponibles
const GASTO_CATEGORIAS = [
    "Alimentación",
    "Vivienda",
    "Transporte",
    "Servicios",
    "Ocio",
    "Salud",
    "Educación",
    "Ropa",
    "Varios"
];

const ExpensesSection = () => {
    const { expenses, addExpense, deleteExpense, loadingExpenses, error } = useData();
    
    // Estado para manejar los campos del nuevo gasto
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        category: GASTO_CATEGORIAS[0] // Categoría por defecto
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewExpense(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newExpense.description.trim() && newExpense.amount) {
            addExpense({
                ...newExpense,
                amount: parseFloat(newExpense.amount)
            });
            // Limpiamos el formulario
            setNewExpense({ description: '', amount: '', category: GASTO_CATEGORIAS[0] });
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Registro de Gastos</h2>
            
            <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-gray-50 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Campo Descripción */}
                <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={newExpense.description}
                        onChange={handleChange}
                        placeholder="Ej: Compra en supermercado"
                        className="mt-1 w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                        required
                    />
                </div>
                
                {/* Campo Monto */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={newExpense.amount}
                        onChange={handleChange}
                        placeholder="Ej: 1500.50"
                        className="mt-1 w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                        required
                    />
                </div>

                {/* Campo Categoría */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                    <select
                        id="category"
                        name="category"
                        value={newExpense.category}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                    >
                        {GASTO_CATEGORIAS.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                
                <div className="md:col-span-4">
                    <button type="submit" className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600">
                        + Añadir Gasto
                    </button>
                </div>
            </form>

            {loadingExpenses && <p>Cargando gastos...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-2">
                {expenses.length > 0 ? (
                    expenses.map(expense => (
                        <li key={expense._id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm border">
                            <div className="flex-grow">
                                <span className="font-semibold">{expense.description}</span>
                                <span className="text-xs ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full">{expense.category}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-lg font-medium text-gray-800 mr-4">${expense.amount.toFixed(2)}</span>
                                <button onClick={() => deleteExpense(expense._id)} className="text-red-500 hover:text-red-700">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    !loadingExpenses && <p>No hay gastos registrados.</p>
                )}
            </ul>
        </>
    );
};

export default ExpensesSection;
