import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

export default function TasksSection() {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await apiService.getTasks();
                setTasks(data);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (taskInput.trim()) {
            try {
                const newTask = await apiService.createTask({ text: taskInput.trim() });
                setTasks([newTask, ...tasks]);
                setTaskInput('');
            } catch (error) {
                console.error("Failed to create task:", error);
            }
        }
    };
    
    const handleToggleComplete = async (taskId) => {
        try {
            const updatedTask = await apiService.updateTask(taskId);
            setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const handleDelete = async (taskId) => {
        // Opcional: Añadir un modal de confirmación aquí
        try {
            await apiService.deleteTask(taskId);
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };
    
    if (loading) {
        return <div className="text-center p-10">Cargando tareas...</div>;
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Lista de Tareas</h2>
            <form onSubmit={handleSubmit} className="flex items-center mb-4">
                <input type="text" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} placeholder="Añadir nueva tarea..." className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500"/>
                <button type="submit" className="bg-indigo-600 text-white p-3 rounded-r-lg hover:bg-indigo-700"><i className="fas fa-plus"></i> Añadir</button>
            </form>
            <ul className="space-y-3">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <li key={task._id} className={`flex items-center justify-between p-3 rounded-lg transition ${task.completed ? 'bg-gray-200 opacity-60' : 'bg-gray-50'}`}>
                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    checked={task.completed} 
                                    onChange={() => handleToggleComplete(task._id)}
                                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-4 cursor-pointer"
                                />
                                <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                    {task.text}
                                </span>
                            </div>
                            <button onClick={() => handleDelete(task._id)} className="text-gray-400 hover:text-red-500 transition">
                                <i className="fas fa-trash"></i>
                            </button>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No hay tareas pendientes.</p>
                )}
            </ul>
        </div>
    );
};
