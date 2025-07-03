import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';

// Función para obtener la clase de color según la fecha
const getDueDateClass = (dueDate, completed) => {
    if (completed || !dueDate) return 'text-gray-500';
    
    const today = new Date();
    const date = new Date(dueDate);
    today.setHours(0, 0, 0, 0); // Ignorar la hora para la comparación

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-red-600 font-semibold'; // Vencida
    if (diffDays <= 3) return 'text-yellow-600'; // Próxima a vencer
    return 'text-gray-500';
};

const TaskItem = ({ task }) => {
    const { updateTask, deleteTask } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(task.description);
    // Formateamos la fecha para el input type="date"
    const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleUpdate = () => {
        const hasDescriptionChanged = description.trim() && description !== task.description;
        const hasDateChanged = dueDate !== (task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        
        if (hasDescriptionChanged || hasDateChanged) {
            updateTask(task._id, { description, dueDate: dueDate || null });
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleUpdate();
        else if (e.key === 'Escape') {
            setDescription(task.description);
            setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
            setIsEditing(false);
        }
    };

    return (
        <li className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-grow mr-4">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => updateTask(task._id, { completed: !task.completed })}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={handleUpdate}
                            onKeyDown={handleKeyDown}
                            className="ml-3 p-1 border rounded-md w-full"
                        />
                    ) : (
                        <span
                            onClick={() => setIsEditing(true)}
                            className={`ml-3 cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
                        >
                            {task.description}
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    {task.dueDate && !isEditing && (
                        <div className={`text-sm ${getDueDateClass(task.dueDate, task.completed)}`}>
                            <i className="far fa-calendar-alt mr-1"></i>
                            {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                    )}
                    {isEditing && (
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="p-1 border rounded-md"
                        />
                    )}
                    <button onClick={() => deleteTask(task._id)} className="text-red-500 hover:text-red-700">
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </li>
    );
};

export default TaskItem;
