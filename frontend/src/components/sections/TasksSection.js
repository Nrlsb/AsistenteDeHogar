import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const TasksSection = () => {
    const { tasks, addTask, updateTask, deleteTask, loadingTasks, error } = useData();
    const [newTask, setNewTask] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTask.trim()) {
            addTask({ description: newTask });
            setNewTask('');
        }
    };

    return (
        // El div contenedor principal se ha movido a App.js para un layout consistente
        <>
            <h2 className="text-2xl font-bold mb-4">Lista de Tareas</h2>
            <form onSubmit={handleSubmit} className="flex mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Añadir nueva tarea"
                    className="flex-grow p-2 border rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
                    + Añadir
                </button>
            </form>

            {loadingTasks && <p>Cargando tareas...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            <ul className="space-y-2">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <li key={task._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <span 
                                onClick={() => updateTask(task._id, { completed: !task.completed })}
                                className={`cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
                            >
                                {task.description}
                            </span>
                            <button onClick={() => deleteTask(task._id)} className="text-red-500 hover:text-red-700">
                                Eliminar
                            </button>
                        </li>
                    ))
                ) : (
                    !loadingTasks && <p>No hay tareas pendientes.</p>
                )}
            </ul>
        </>
    );
};

export default TasksSection;
