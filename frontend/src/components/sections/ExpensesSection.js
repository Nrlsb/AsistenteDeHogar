import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const ExpensesSection = () => {
    const { expenses, addExpense, deleteExpense, loadingExpenses, error } = useData();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (description.trim() && amount) {
            addExpense({ description, amount: Number(amount) });
            setDescription('');
            setAmount('');
        }
    };
    
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Control de Gastos</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del gasto"
                    className="md:col-span-2 p-2 border rounded-md"
                />
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Monto"
                    className="p-2 border rounded-md"
                />
                <button type="submit" className="md:col-span-3 bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600">
                    Añadir Gasto
                </button>
            </form>

            {loadingExpenses && <p>Cargando gastos...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-2 mb-4">
                {expenses.length > 0 ? (
                    expenses.map((expense) => (
                        <li key={expense._id} className="flex justify-between p-2 border rounded-md">
                            <span>{expense.description}</span>
                            <div className="flex items-center space-x-4">
                                <span>${expense.amount.toFixed(2)}</span>
                                <button onClick={() => deleteExpense(expense._id)} className="text-red-500 text-sm">Eliminar</button>
                            </div>
                        </li>
                    ))
                ) : (
                    !loadingExpenses && <p>No hay gastos registrados.</p>
                )}
            </ul>
             <div className="text-right font-bold text-xl">
                Total: ${totalExpenses.toFixed(2)}
            </div>
        </div>
    );
};

export default ExpensesSection;
