// frontend/src/components/layout/Navigation.js
import React from 'react';
import { FaTasks, FaShoppingCart, FaChartLine, FaUtensils } from 'react-icons/fa';

const Navigation = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'tasks', label: 'Tareas', icon: <FaTasks /> },
    { id: 'shopping', label: 'Compras', icon: <FaShoppingCart /> },
    { id: 'expenses', label: 'Gastos', icon: <FaChartLine /> },
    { id: 'meals', label: 'Comidas', icon: <FaUtensils /> },
  ];

  const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer text-lg";
  const activeClasses = "bg-blue-500 text-white shadow-md";
  const inactiveClasses = "text-gray-600 hover:bg-gray-200 hover:text-gray-800";

  return (
    <aside className="w-full md:w-64 bg-white md:h-screen p-4 md:fixed md:top-0 md:left-0 border-r">
      <div className="md:hidden mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Asistente de Hogar</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              {/* CORRECCIÓN: Usamos un botón con onClick en lugar de un Link */}
              <button
                onClick={() => setActiveSection(item.id)}
                className={`${baseClasses} w-full text-left ${
                  activeSection === item.id ? activeClasses : inactiveClasses
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Navigation;
