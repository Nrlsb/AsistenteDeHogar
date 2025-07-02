import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const MealsSection = () => {
    const { meals, addMealPlan, deleteMealPlan, loadingMeals, error } = useData();
    const [day, setDay] = useState('Lunes');
    const [meal, setMeal] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (meal.trim()) {
            addMealPlan({ day, meal });
            setMeal('');
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Plan de Comidas</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <select value={day} onChange={(e) => setDay(e.target.value)} className="p-2 border rounded-md">
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={meal}
                    onChange={(e) => setMeal(e.target.value)}
                    placeholder="¿Qué vas a comer?"
                    className="md:col-span-2 p-2 border rounded-md"
                />
                <button type="submit" className="md:col-span-3 bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600">
                    Añadir al Plan
                </button>
            </form>

            {loadingMeals && <p>Cargando plan de comidas...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-4">
                {meals.length > 0 ? (
                    meals.map(plan => (
                        <div key={plan._id} className="p-2 border rounded-md">
                            <h3 className="font-bold">{plan.day}</h3>
                            <div className="flex justify-between items-center">
                                <p>{plan.meal}</p>
                                <button onClick={() => deleteMealPlan(plan._id)} className="text-red-500 text-sm">Eliminar</button>
                            </div>
                        </div>
                    ))
                ) : (
                    !loadingMeals && <p>No hay comidas planificadas.</p>
                )}
            </div>
        </div>
    );
};

export default MealsSection;
