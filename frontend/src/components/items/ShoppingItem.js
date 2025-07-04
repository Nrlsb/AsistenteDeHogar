// frontend/src/components/items/ShoppingItem.js
import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { FaTrash } from 'react-icons/fa';

const ShoppingItem = ({ item, listId }) => {
  const { updateShoppingItem, deleteShoppingItem } = useContext(DataContext);

  const handleToggleComplete = () => {
    // Llama a la función del contexto para actualizar el estado del artículo
    updateShoppingItem(listId, item._id, { completed: !item.completed });
  };

  const handleDelete = () => {
    // Llama a la función del contexto para eliminar el artículo
    deleteShoppingItem(listId, item._id);
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${item.completed ? 'bg-green-50' : 'bg-white hover:bg-gray-50'}`}>
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={handleToggleComplete}
          className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
        />
        <span className={`flex-grow ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {item.text}
        </span>
      </div>
      <button
        onClick={handleDelete}
        className="text-gray-400 hover:text-red-600 transition-colors opacity-50 hover:opacity-100"
        aria-label="Eliminar artículo"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default ShoppingItem;
