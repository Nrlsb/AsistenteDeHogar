import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import ShoppingItem from '../items/ShoppingItem'; // Importamos el nuevo componente

const ShoppingSection = () => {
    const { shoppingItems, addShoppingItem, loadingShopping, error } = useData();
    const [newItem, setNewItem] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newItem.trim()) {
            addShoppingItem({ name: newItem });
            setNewItem('');
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Lista de Compras</h2>
            <form onSubmit={handleSubmit} className="flex mb-4">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Añadir nuevo artículo"
                    className="flex-grow p-2 border rounded-l-md focus:ring-green-500 focus:border-green-500"
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600">
                    + Añadir
                </button>
            </form>

            {loadingShopping && <p>Cargando lista de compras...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-2">
                {shoppingItems.length > 0 ? (
                    // Usamos el componente ShoppingItem para renderizar cada artículo
                    shoppingItems.map(item => (
                        <ShoppingItem key={item._id} item={item} />
                    ))
                ) : (
                    !loadingShopping && <p>No hay artículos en la lista de compras.</p>
                )}
            </ul>
        </>
    );
};

export default ShoppingSection;
