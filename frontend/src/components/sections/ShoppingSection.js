import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import ShoppingItem from '../items/ShoppingItem';

// --- Iconos SVG ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;


// --- Componente para una Lista de Compras Individual ---
const ShoppingListComponent = ({ list }) => {
    const { addShoppingItem, deleteShoppingList } = useData();
    const [newItemName, setNewItemName] = useState('');

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItemName.trim()) return;
        addShoppingItem(list._id, { name: newItemName });
        setNewItemName('');
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{list.name}</h3>
                <button onClick={() => deleteShoppingList(list._id)} className="text-gray-400 hover:text-red-500">
                    <TrashIcon />
                </button>
            </div>
            
            {/* Formulario para añadir artículos a ESTA lista */}
            <form onSubmit={handleAddItem} className="flex items-center mb-4">
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Añadir artículo"
                    className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-300">
                    Añadir
                </button>
            </form>

            {/* Artículos de la lista */}
            {list.items && list.items.length > 0 ? (
                <ul>
                    {list.items.map(item => (
                        <ShoppingItem key={item._id} item={item} listId={list._id} />
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">No hay artículos en esta lista.</p>
            )}
        </div>
    );
};


// --- Componente Principal de la Sección de Compras ---
const ShoppingSection = () => {
    const { shoppingLists, addShoppingList, loadingShopping } = useData();
    const [newListName, setNewListName] = useState('');

    const handleAddList = (e) => {
        e.preventDefault();
        if (!newListName.trim()) return;
        addShoppingList({ name: newListName });
        setNewListName('');
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Listas de Compras</h2>

            {/* Formulario para crear una NUEVA LISTA */}
            <form onSubmit={handleAddList} className="mb-8 bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="Crear una nueva lista (ej: Supermercado)"
                        className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 flex items-center font-semibold">
                        <PlusIcon /> <span className="ml-2">Crear Lista</span>
                    </button>
                </div>
            </form>

            {/* Contenedor de las listas existentes */}
            {loadingShopping ? (
                <p>Cargando listas...</p>
            ) : shoppingLists.length > 0 ? (
                <div>
                    {shoppingLists.map((list) => (
                        <ShoppingListComponent key={list._id} list={list} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-700">¡Bienvenido!</h3>
                    <p className="text-gray-500 mt-2">Parece que no tienes ninguna lista de compras. ¡Crea una para empezar a organizarte!</p>
                </div>
            )}
        </div>
    );
};

export default ShoppingSection;
