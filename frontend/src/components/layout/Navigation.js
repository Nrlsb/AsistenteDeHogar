import React from 'react';
import { useAuth } from '../../context/AuthContext';

// --- Iconos SVG para reemplazar react-icons ---
const TaskIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ChartLineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const UtensilsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SignOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;


const Navigation = ({ onNavigate, activeSection }) => {
    const { user, logout } = useAuth();

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
                        <li><button onClick={() => onNavigate('tasks')} className={getLinkClass('tasks')}><TaskIcon /> Tareas</button></li>
                        <li><button onClick={() => onNavigate('shopping')} className={getLinkClass('shopping')}><ShoppingCartIcon /> Compras</button></li>
                        <li><button onClick={() => onNavigate('expenses')} className={getLinkClass('expenses')}><ChartLineIcon /> Gastos</button></li>
                        <li><button onClick={() => onNavigate('meals')} className={getLinkClass('meals')}><UtensilsIcon /> Comidas</button></li>
                    </ul>
                </nav>
            </div>
            <div className="border-t pt-4">
                <ul>
                    <li>
                        <div className="flex items-center p-3 text-lg text-gray-700">
                            <UserCircleIcon />
                            <span className="font-semibold">{user ? user.name : 'Cargando...'}</span>
                        </div>
                    </li>
                    <li>
                        <button onClick={logout} className="flex items-center p-3 my-1 text-lg text-red-600 hover:bg-red-100 rounded-lg w-full transition-colors">
                            <SignOutIcon />
                            Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navigation;
