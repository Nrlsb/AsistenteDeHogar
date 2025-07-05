import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTasks, FaShoppingCart, FaUtensils, FaChartLine, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Navigation = ({ onNavigate }) => {
    // 1. Obtenemos el objeto 'user' desde el contexto de autenticación.
    const { user, logout } = useAuth();
    const location = useLocation();

    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `flex items-center p-3 my-1 text-lg rounded-lg transition-colors ${
            isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
        }`;
    };

    return (
        <div className="h-full bg-white shadow-lg flex flex-col justify-between p-4">
            <div>
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Asistente de Hogar</h1>
                <nav>
                    <ul>
                        <li><NavLink to="/" className={getLinkClass('/')} onClick={() => onNavigate('tasks')}><FaTasks className="mr-3" /> Tareas</NavLink></li>
                        <li><NavLink to="/shopping" className={getLinkClass('/shopping')} onClick={() => onNavigate('shopping')}><FaShoppingCart className="mr-3" /> Compras</NavLink></li>
                        <li><NavLink to="/expenses" className={getLinkClass('/expenses')} onClick={() => onNavigate('expenses')}><FaChartLine className="mr-3" /> Gastos</NavLink></li>
                        <li><NavLink to="/meals" className={getLinkClass('/meals')} onClick={() => onNavigate('meals')}><FaUtensils className="mr-3" /> Comidas</NavLink></li>
                    </ul>
                </nav>
            </div>
            <div className="border-t pt-4">
                <ul>
                    <li>
                        {/* 2. Mostramos el nombre del usuario. Si aún no ha cargado, se muestra un texto temporal. */}
                        <div className="flex items-center p-3 text-lg text-gray-700">
                            <FaUserCircle className="mr-3 text-xl" />
                            <span className="font-semibold">{user ? user.name : 'Cargando...'}</span>
                        </div>
                    </li>
                    <li>
                        <button onClick={logout} className="flex items-center p-3 my-1 text-lg text-red-600 hover:bg-red-100 rounded-lg w-full transition-colors">
                            <FaSignOutAlt className="mr-3" />
                            Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navigation;
