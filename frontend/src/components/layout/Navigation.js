import React from 'react';

// Array con la configuración de las pestañas para no repetir código
const TABS = [
    { key: 'tasks', label: 'Tareas', icon: 'fas fa-tasks' },
    { key: 'shopping', label: 'Compras', icon: 'fas fa-shopping-cart' },
    { key: 'expenses', label: 'Gastos', icon: 'fas fa-wallet' },
    { key: 'meals', label: 'Comidas', icon: 'fas fa-utensils' },
];

export default function Navigation({ activeTab, setActiveTab }) {
    // Estilos base para los botones de las pestañas
    const baseTabStyle = "flex-1 text-center py-3 px-2 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2";
    // Estilos para la pestaña activa
    const activeTabStyle = "bg-indigo-600 text-white shadow-md";
    // Estilos para las pestañas inactivas
    const inactiveTabStyle = "bg-white text-gray-600 hover:bg-gray-200";

    return (
        <nav className="bg-gray-200 p-2 rounded-xl mb-6 md:mb-8">
            <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                {TABS.map(tab => (
                    <li key={tab.key} className="flex-1">
                        <button
                            onClick={() => setActiveTab(tab.key)}
                            className={`${baseTabStyle} ${activeTab === tab.key ? activeTabStyle : inactiveTabStyle}`}
                        >
                            <i className={tab.icon}></i>
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
