// frontend/src/components/shopping/ShoppingListCard.js
import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';
import ShoppingItem from '../items/ShoppingItem';
import { FaTrash, FaShareAlt, FaPlus, FaUserFriends } from 'react-icons/fa';
import ConfirmationModal from '../common/ConfirmationModal';

const ShoppingListCard = ({ list }) => {
  const { 
    addShoppingItem, 
    deleteShoppingList, 
    shareShoppingList 
  } = useContext(DataContext);
  const { user } = useContext(AuthContext);

  const [newItemText, setNewItemText] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [isShareVisible, setShareVisible] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    addShoppingItem(list._id, { text: newItemText });
    setNewItemText('');
  };

  const handleShare = (e) => {
    e.preventDefault();
    if (!shareEmail.trim()) return;
    shareShoppingList(list._id, shareEmail);
    setShareEmail('');
    setShareVisible(false);
  };

  // El propietario es quien creó la lista. Comparamos el ID del usuario logueado con el ID del usuario en la lista.
  // El objeto 'user' de la lista puede estar poblado (con ._id) o ser solo el ID.
  const isOwner = user.id === (list.user?._id || list.user);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg border border-gray-200 transition-shadow hover:shadow-xl">
      {/* Header de la lista */}
      <div className="flex justify-between items-start mb-4">
        <div>
            <h3 className="text-2xl font-bold text-gray-800">{list.name}</h3>
            {!isOwner && (
                <p className='text-sm text-gray-500 flex items-center gap-2 mt-1'>
                    <FaUserFriends />
                    Compartida por {list.user?.name || 'otro usuario'}
                </p>
            )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShareVisible(!isShareVisible)}
            className="text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-100"
            aria-label="Compartir lista"
          >
            <FaShareAlt size={18}/>
          </button>
          {isOwner && (
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-100"
              aria-label="Eliminar lista"
            >
              <FaTrash size={18}/>
            </button>
          )}
        </div>
      </div>

      {/* Formulario para compartir (visible condicionalmente) */}
      {isShareVisible && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
            <form onSubmit={handleShare} className="flex flex-col sm:flex-row gap-2">
            <input
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="Email del usuario a compartir"
                className="flex-grow p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
                Compartir
            </button>
            </form>
        </div>
      )}

      {/* Formulario para añadir artículos */}
      <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Añadir un nuevo artículo..."
          className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors shadow-sm hover:shadow-md">
          <FaPlus />
        </button>
      </form>

      {/* Lista de artículos */}
      <div className="space-y-2">
        {list.items && list.items.length > 0 ? (
          list.items.map((item) => (
            <ShoppingItem key={item._id} item={item} listId={list._id} />
          ))
        ) : (
          <p className="text-center text-sm text-gray-400 py-4">Esta lista está vacía.</p>
        )}
      </div>

      {/* Modal de confirmación para eliminar lista */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          deleteShoppingList(list._id);
          setDeleteModalOpen(false);
        }}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que quieres eliminar la lista "${list.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};

export default ShoppingListCard;
