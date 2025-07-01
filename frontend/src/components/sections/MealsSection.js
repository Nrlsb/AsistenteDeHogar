import React, { useState, useEffect, useMemo, useCallback } from 'react';
import apiService from '../../services/apiService';
import { debounce } from 'lodash';

export default function MealsSection() {
    const [plan, setPlan] = useState({});
    const [loading, setLoading] = useState(true);
    const days = useMemo(() => ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], []);
    const meals = useMemo(() => ['Desayuno', 'Almuerzo', 'Cena'], []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiService.getMealPlan();
                setPlan(data);
            } catch (error) {
                console.error("Error al cargar plan de comidas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const debouncedUpdate = useCallback(debounce(updatedPlan => {
        apiService.updateMealPlan(updatedPlan);
    }, 1000), []);

    const handleChange = (day, meal, value) => {
        const newPlan = { ...plan, [day]: { ...plan[day], [meal]: value } };
        setPlan(newPlan);
        debouncedUpdate(newPlan);
    };

    if (loading) return <div className="text-center p-10">Cargando planificador...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Planificador de Comidas Semanal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {days.map(day => (
                    <div key={day} className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-bold text-lg mb-3">{day}</h3>
                        <div className="space-y-2">
                            {meals.map(meal => (
                                <div key={meal}>
                                    <label className="block text-sm font-medium">{meal}</label>
                                    <input
                                        type="text"
                                        value={plan[day]?.[meal] || ''}
                                        onChange={e => handleChange(day, meal, e.target.value)}
                                        className="mt-1 block w-full p-2 border rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
