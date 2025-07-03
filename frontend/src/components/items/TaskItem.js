import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';

const TaskItem = ({ task }) => {
    const { updateTask, deleteTask } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(task.description);
    const inputRef = useRef(null);

    // Enfocar el input cuando el modo de edición se activa
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleUpdate = () => {
        if (description.trim() && description !== task.description) {
            updateTask(task._id, { description });
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleUpdate();
        } else if (e.key === 'Escape') {
            setDescription(task.description); // Revertir cambios
            setIsEditing(false);
        }
    };

    return (
        <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
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
            <button onClick={() => deleteTask(task._id)} className="text-red-500 hover:text-red-700 transition-colors">
                <i className="fas fa-trash"></i>
            </button>
        </li>
    );
};

export default TaskItem;
