import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import TaskItem from '../items/TaskItem'; // Importamos el nuevo componente

const TasksSection = () => {
    const { tasks, addTask, loadingTasks, error } = useData();
    const [newTask, setNewTask] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTask.trim()) {
            addTask({ description: newTask });
            setNewTask('');
        }
    };

    return (
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
                    // Usamos el componente TaskItem para renderizar cada tarea
                    tasks.map(task => (
                        <TaskItem key={task._id} task={task} />
                    ))
                ) : (
                    !loadingTasks && <p>No hay tareas pendientes.</p>
                )}
            </ul>
        </>
    );
};

export default TasksSection;
