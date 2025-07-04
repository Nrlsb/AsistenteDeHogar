// frontend/src/components/sections/ShoppingSection.js
import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import ShoppingListCard from '../shopping/ShoppingListCard'; // Importaremos el nuevo componente
import { FaPlus } from 'react-icons/fa';

const ShoppingSection = () => {
  const { shoppingLists, addShoppingList } = useContext(DataContext);
  const [newListName, setNewListName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    addShoppingList(newListName);
    setNewListName('');
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Listas de Compras</h2>

      {/* Formulario para crear nueva lista */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-8 border">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Nombre de la nueva lista (ej. Supermercado)"
            className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            <FaPlus /> Crear Lista
          </button>
        </form>
      </div>


      {/* Contenedor de las listas */}
      <div className="space-y-6">
        {shoppingLists && shoppingLists.length > 0 ? (
          shoppingLists.map((list) => (
            <ShoppingListCard key={list._id} list={list} />
          ))
        ) : (
          <div className="text-center py-10 px-4 bg-white rounded-xl shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-700">¡Bienvenido!</h3>
            <p className="text-gray-500 mt-2">
              Parece que no tienes ninguna lista de compras. ¡Crea una para empezar a organizarte!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingSection;
