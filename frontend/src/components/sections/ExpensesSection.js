import React, { useState, useEffect, useMemo } from 'react';
import apiService from '../../services/apiService';

export default function ExpensesSection() {
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiService.getExpenses();
                setExpenses(data);
            } catch (error) {
                console.error("Error al cargar gastos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalExpenses = useMemo(() => {
        const currentMonth = new Date().getMonth();
        return expenses
            .filter(e => new Date(e.createdAt).getMonth() === currentMonth)
            .reduce((sum, e) => sum + e.amount, 0);
    }, [expenses]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim() || !amount) return;
        const newExpense = await apiService.createExpense({ description, amount });
        setExpenses([newExpense, ...expenses]);
        setDescription('');
        setAmount('');
    };

    const handleDelete = async (id) => {
        await apiService.deleteExpense(id);
        setExpenses(expenses.filter(e => e._id !== id));
    };

    if (loading) return <div className="text-center p-10">Cargando gastos...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Registro de Gastos</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción..." className="p-3 border rounded-lg md:col-span-2"/>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Monto ($)" className="p-3 border rounded-lg"/>
                <button type="submit" className="bg-indigo-600 text-white p-3 rounded-lg">Añadir Gasto</button>
            </form>
            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold">Gasto Total del Mes: <span className="font-bold">${totalExpenses.toFixed(2)}</span></h3>
            </div>
            <ul className="space-y-3">
                {expenses.map(exp => (
                    <li key={exp._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p>{exp.description}</p>
                            <p className="text-sm text-gray-500">{new Date(exp.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">${exp.amount.toFixed(2)}</span>
                            <button onClick={() => handleDelete(exp._id)} className="text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
