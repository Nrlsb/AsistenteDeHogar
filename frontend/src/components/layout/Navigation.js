// frontend/src/components/layout/Navigation.js
import React from 'react';
import {
  FaTasks,
  FaShoppingCart,
  FaChartLine,
  FaUtensils,
  FaSignOutAlt,
  FaUserCircle,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navigation = ({ activeSection, setActiveSection }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'tasks', label: 'Tareas', icon: <FaTasks /> },
    { id: 'shopping', label: 'Compras', icon: <FaShoppingCart /> },
    { id: 'expenses', label: 'Gastos', icon: <FaChartLine /> },
    { id: 'meals', label: 'Comidas', icon: <FaUtensils /> },
  ];

  const baseClasses = "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer text-md";
  const activeClasses = "bg-blue-500 text-white shadow-md font-semibold";
  const inactiveClasses = "text-gray-600 hover:bg-gray-200 hover:text-gray-800";

  return (
    <aside className="w-64 bg-white h-screen p-4 fixed top-0 left-0 border-r flex flex-col">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="mb-8 p-2">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Asistente de Hogar</h1>
          </div>
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
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
        </div>

        <div className="border-t pt-4">
            <div className="flex items-center gap-3 p-2 mb-3">
                <FaUserCircle className="text-gray-500" size={24} />
                {/* CORRECCIÓN: Nos aseguramos de que user y user.name existan antes de mostrarlos */}
                <span className="font-medium text-gray-700 truncate">{user && user.name ? user.name : 'Usuario'}</span>
            </div>
          <button
            onClick={logout}
            className={`${baseClasses} w-full text-left text-red-500 hover:bg-red-100`}
          >
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
