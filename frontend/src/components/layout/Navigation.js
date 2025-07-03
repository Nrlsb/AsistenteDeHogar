import React from 'react';
import { NavLink } from 'react-router-dom';

// Definimos las pestañas como un array de objetos para que sea más fácil de mantener
const TABS = [
    { path: '/tasks', label: 'Tareas', icon: '📝' },
    { path: '/shopping', label: 'Compras', icon: '🛒' },
    { path: '/expenses', label: 'Gastos', icon: '💸' },
    { path: '/meals', label: 'Comidas', icon: '🍔' },
];

const Navigation = () => {
    return (
        <nav className="bg-gray-100 p-2 sm:p-4 rounded-lg shadow-inner">
            <ul className="flex flex-wrap space-x-2 sm:space-x-4">
                {TABS.map(tab => (
                    <li key={tab.path}>
                        <NavLink
                            to={tab.path}
                            // className ahora es una función que nos da el estado 'isActive'
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md' // Estilos para la pestaña activa
                                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900' // Estilos para pestañas inactivas
                                }`
                            }
                        >
                            <span className="mr-2 hidden sm:inline">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;
