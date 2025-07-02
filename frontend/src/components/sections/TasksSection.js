import React, { useState } from 'react';
import { useData } from '../../context/DataContext'; // Usamos el nuevo DataContext

const TasksSection = () => {
    // Obtenemos los datos y funciones del contexto, no de la API directamente
    const { tasks, addTask, updateTask, deleteTask, loading, error } = useData();
    const [newTask, setNewTask] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTask.trim()) {
            addTask({ text: newTask });
            setNewTask('');
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Lista de Tareas</h2>
            <form onSubmit={handleSubmit} className="flex mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Añadir nueva tarea"
                    className="flex-grow p-2 border rounded-l-md focus:outline-none"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600">
                    + Añadir
                </button>
            </form>

            {loading && <p>Cargando tareas...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            <ul className="space-y-2">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <li
                            key={task._id}
                            className="flex items-center justify-between p-2 border rounded-md"
                        >
                            <span
                                onClick={() => updateTask(task._id, { completed: !task.completed })}
                                className={`cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
                            >
                                {task.text}
                            </span>
                            <button
                                onClick={() => deleteTask(task._id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))
                ) : (
                    !loading && <p>No hay tareas pendientes.</p>
                )}
            </ul>
        </div>
    );
};

export default TasksSection;
