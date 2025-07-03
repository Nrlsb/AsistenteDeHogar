import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';

const ShoppingItem = ({ item }) => {
    const { updateShoppingItem, deleteShoppingItem } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(item.name);
    const inputRef = useRef(null);

    // Enfocar el input cuando el modo de edición se activa
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleUpdate = () => {
        if (name.trim() && name !== item.name) {
            updateShoppingItem(item._id, { name });
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleUpdate();
        } else if (e.key === 'Escape') {
            setName(item.name); // Revertir cambios
            setIsEditing(false);
        }
    };

    return (
        <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
            <div className="flex items-center flex-grow mr-4">
                <input
                    type="checkbox"
                    checked={item.purchased}
                    onChange={() => updateShoppingItem(item._id, { purchased: !item.purchased })}
                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                />
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleUpdate}
                        onKeyDown={handleKeyDown}
                        className="ml-3 p-1 border rounded-md w-full"
                    />
                ) : (
                    <span
                        onClick={() => setIsEditing(true)}
                        className={`ml-3 cursor-pointer ${item.purchased ? 'line-through text-gray-500' : ''}`}
                    >
                        {item.name}
                    </span>
                )}
            </div>
            <button onClick={() => deleteShoppingItem(item._id)} className="text-red-500 hover:text-red-700 transition-colors">
                <i className="fas fa-trash"></i>
            </button>
        </li>
    );
};

export default ShoppingItem;
