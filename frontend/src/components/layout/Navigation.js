import React from 'react';
// Se eliminan las importaciones de 'react-router-dom' para evitar conflictos.
import { useAuth } from '../../context/AuthContext';
import { FaTasks, FaShoppingCart, FaUtensils, FaChartLine, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

// El componente ahora recibe 'activeSection' para saber qué botón resaltar.
const Navigation = ({ onNavigate, activeSection }) => {
    const { user, logout } = useAuth();

    // La función ahora compara el nombre de la sección, no una ruta de URL.
    const getLinkClass = (section) => {
        const isActive = activeSection === section;
        return `flex items-center p-3 my-1 text-lg rounded-lg transition-colors w-full text-left ${
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
                        {/* Se reemplazan los 'NavLink' por 'button' para un manejo de estado más simple. */}
                        <li><button onClick={() => onNavigate('tasks')} className={getLinkClass('tasks')}><FaTasks className="mr-3" /> Tareas</button></li>
                        <li><button onClick={() => onNavigate('shopping')} className={getLinkClass('shopping')}><FaShoppingCart className="mr-3" /> Compras</button></li>
                        <li><button onClick={() => onNavigate('expenses')} className={getLinkClass('expenses')}><FaChartLine className="mr-3" /> Gastos</button></li>
                        <li><button onClick={() => onNavigate('meals')} className={getLinkClass('meals')}><FaUtensils className="mr-3" /> Comidas</button></li>
                    </ul>
                </nav>
            </div>
            <div className="border-t pt-4">
                <ul>
                    <li>
                        {/* El nombre del usuario ahora debería mostrarse correctamente. */}
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
