import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

export default function ShoppingSection() {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newItemInputs, setNewItemInputs] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catData, itemData] = await Promise.all([
                    apiService.getShoppingCategories(),
                    apiService.getShoppingItems()
                ]);
                setCategories(catData);
                setItems(itemData);
            } catch (error) {
                console.error("Error al cargar datos de compras:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        const createdCategory = await apiService.createShoppingCategory({ name: newCategory });
        setCategories([...categories, createdCategory]);
        setNewCategory('');
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('¿Seguro? Se borrarán todos los productos de esta lista.')) {
            await apiService.deleteShoppingCategory(id);
            setCategories(categories.filter(c => c._id !== id));
            setItems(items.filter(i => i.category !== id));
        }
    };

    const handleAddItem = async (e, categoryId) => {
        e.preventDefault();
        const name = newItemInputs[categoryId];
        if (!name || !name.trim()) return;
        const createdItem = await apiService.createShoppingItem({ name, categoryId });
        setItems([...items, createdItem]);
        setNewItemInputs({ ...newItemInputs, [categoryId]: '' });
    };

    const handleToggleItem = async (id) => {
        const updatedItem = await apiService.updateShoppingItem(id);
        setItems(items.map(i => i._id === id ? updatedItem : i));
    };

    if (loading) return <div className="text-center p-10">Cargando listas...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Lista de Compras</h2>
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2">Añadir nueva lista</h3>
                <form onSubmit={handleAddCategory} className="flex gap-2">
                    <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Ej: Supermercado, Farmacia..." className="flex-grow p-3 border rounded-lg"/>
                    <button type="submit" className="bg-indigo-600 text-white p-3 rounded-lg shrink-0">Crear</button>
                </form>
            </div>
            <div className="space-y-6">
                {categories.map(cat => (
                    <div key={cat._id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold">{cat.name}</h3>
                            <button onClick={() => handleDeleteCategory(cat._id)} className="text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                        </div>
                        <form onSubmit={e => handleAddItem(e, cat._id)} className="flex gap-2 mb-3">
                            <input type="text" value={newItemInputs[cat._id] || ''} onChange={e => setNewItemInputs({...newItemInputs, [cat._id]: e.target.value})} placeholder="Añadir producto..." className="flex-grow p-2 border rounded-lg"/>
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg shrink-0"><i className="fas fa-plus"></i></button>
                        </form>
                        <ul className="space-y-2">
                            {items.filter(i => i.category === cat._id).map(item => (
                                <li key={item._id} className={`flex items-center p-2 rounded ${item.purchased ? 'opacity-50' : ''}`}>
                                    <input type="checkbox" checked={item.purchased} onChange={() => handleToggleItem(item._id)} className="h-5 w-5 mr-3"/>
                                    <span className={item.purchased ? 'line-through' : ''}>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
