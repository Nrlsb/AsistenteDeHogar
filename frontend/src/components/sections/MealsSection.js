import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MEAL_TYPES = ['Desayuno', 'Almuerzo', 'Cena'];

const MealInput = ({ day, mealType, value, onSave }) => {
    const [text, setText] = useState(value || '');
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        if (text !== (value || '')) {
            onSave(day, mealType, text);
        }
        setIsEditing(false);
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setText(value || '');
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-full p-2 border rounded-md bg-white shadow-sm"
                autoFocus
            />
        );
    }

    return (
        <div 
            onClick={() => setIsEditing(true)} 
            className="w-full h-full p-2 cursor-pointer hover:bg-gray-100 rounded-md min-h-[40px] flex items-center justify-start"
        >
            {value || <span className="text-gray-400 italic text-sm">Añadir comida...</span>}
        </div>
    );
};

const MealsSection = () => {
    // CORRECCIÓN: Se usa 'updateSingleMeal' que ahora está correctamente implementado en DataContext
    const { mealPlan, updateSingleMeal, loading: loadingMeals, error } = useData();

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Plan de Comidas Semanal</h2>
            
            {loadingMeals && <p>Cargando plan de comidas...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loadingMeals && mealPlan && (
                 <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 p-2 font-semibold text-left">Día</th>
                                {MEAL_TYPES.map(type => (
                                    <th key={type} className="border border-gray-300 p-2 font-semibold text-left">{type}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {DAYS.map(day => (
                                <tr key={day} className="even:bg-gray-50">
                                    <td className="border border-gray-300 p-2 font-medium">{day}</td>
                                    {MEAL_TYPES.map(mealType => (
                                        <td key={`${day}-${mealType}`} className="border border-gray-300 p-1 align-top">
                                            <MealInput 
                                                day={day}
                                                mealType={mealType}
                                                value={mealPlan[day]?.[mealType]}
                                                onSave={updateSingleMeal}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MealsSection;
