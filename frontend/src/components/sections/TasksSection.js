import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import TaskItem from '../items/TaskItem';

const TasksSection = () => {
    const { tasks, addTask, loadingTasks, error } = useData();
    const [newTask, setNewTask] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTask.trim()) {
            // Pasamos un objeto con la descripción y la fecha
            addTask({
                description: newTask,
                dueDate: dueDate || null // Si no hay fecha, enviamos null
            });
            setNewTask('');
            setDueDate('');
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Lista de Tareas</h2>
            <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-gray-50 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Nueva Tarea</label>
                    <input
                        type="text"
                        id="description"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Añadir nueva tarea"
                        className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Fecha Límite</label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="md:col-span-3">
                    <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        + Añadir Tarea
                    </button>
                </div>
            </form>

            {loadingTasks && <p>Cargando tareas...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            <ul className="space-y-2">
                {tasks.length > 0 ? (
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
