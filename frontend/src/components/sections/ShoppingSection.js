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
        // El div contenedor principal se ha movido a App.js para un layout consistente
        <>
            <h2 className="text-2xl font-bold mb-4">Lista de Compras</h2>
            <form onSubmit={handleSubmit} className="flex mb-4">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Añadir nuevo artículo"
                    className="flex-grow p-2 border rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
                    + Añadir
                </button>
            </form>

            {loadingShopping && <p>Cargando lista de compras...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-2">
                {shoppingItems.length > 0 ? (
                    shoppingItems.map(item => (
                        <li key={item._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <span 
                                onClick={() => updateShoppingItem(item._id, { purchased: !item.purchased })}
                                className={`cursor-pointer ${item.purchased ? 'line-through text-gray-500' : ''}`}
                            >
                                {item.name}
                            </span>
                            <button onClick={() => deleteShoppingItem(item._id)} className="text-red-500 hover:text-red-700">
                                Eliminar
                            </button>
                        </li>
                    ))
                ) : (
                    !loadingShopping && <p>La lista de compras está vacía.</p>
                )}
            </ul>
        </>
    );
};

export default ShoppingSection;
