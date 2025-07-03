import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const ExpensesSection = () => {
    const { expenses, addExpense, deleteExpense, loadingExpenses, error } = useData();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (description.trim() && amount) {
            addExpense({ description, amount: parseFloat(amount) });
            setDescription('');
            setAmount('');
        }
    };

    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

    return (
        // El div contenedor principal se ha movido a App.js para un layout consistente
        <>
            <h2 className="text-2xl font-bold mb-4">Registro de Gastos</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del gasto"
                    className="p-2 border rounded-md md:col-span-2"
                    required
                />
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Monto"
                    className="p-2 border rounded-md"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 md:col-span-3">
                    + Añadir Gasto
                </button>
            </form>

            {loadingExpenses && <p>Cargando gastos...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Total Gastado: ${totalExpenses.toFixed(2)}</h3>
                {expenses.length > 0 ? (
                    expenses.map(expense => (
                        <div key={expense._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div>
                                <p>{expense.description}</p>
                                <p className="text-sm text-gray-500">{new Date(expense.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="font-medium">${expense.amount.toFixed(2)}</span>
                                <button onClick={() => deleteExpense(expense._id)} className="text-red-500 hover:text-red-700">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    !loadingExpenses && <p>No hay gastos registrados.</p>
                )}
            </div>
        </>
    );
};

export default ExpensesSection;
