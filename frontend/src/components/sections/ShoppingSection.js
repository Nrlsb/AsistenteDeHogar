import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const ShoppingSection = () => {
    const { shoppingItems, addShoppingItem, updateShoppingItem, deleteShoppingItem, loadingShopping, error } = useData();
    const [newItem, setNewItem] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newItem.trim()) {
            addShoppingItem({ name: newItem });
            setNewItem('');
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Lista de Compras</h2>
            <form onSubmit={handleSubmit} className="flex mb-4">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Añadir nuevo artículo"
                    className="flex-grow p-2 border rounded-l-md focus:outline-none"
                />
                <button type="submit" className="bg-green-500 text-white p-2 rounded-r-md hover:bg-green-600">
                    + Añadir
                </button>
            </form>

            {loadingShopping && <p>Cargando artículos...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-2">
                {shoppingItems.length > 0 ? (
                    shoppingItems.map((item) => (
                        <li key={item._id} className="flex items-center justify-between p-2 border rounded-md">
                            <span
                                onClick={() => updateShoppingItem(item._id, { purchased: !item.purchased })}
                                className={`cursor-pointer ${item.purchased ? 'line-through text-gray-500' : ''}`}
                            >
                                {item.name}
                            </span>
                            <button
                                onClick={() => deleteShoppingItem(item._id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))
                ) : (
                    !loadingShopping && <p>No hay artículos en la lista.</p>
                )}
            </ul>
        </div>
    );
};

export default ShoppingSection;
