import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    // Obtenemos el usuario y la función de logout del contexto de autenticación
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <div>
                <h1 className="text-xl font-semibold text-gray-800">Asistente de Hogar</h1>
            </div>
            {/* Añadimos una comprobación para asegurarnos de que el objeto 'user'
                existe antes de intentar renderizar la información del usuario.
                Esto previene errores si el componente se renderiza antes de que
                el estado del usuario esté completamente cargado.
            */}
            {user && (
                <div className="flex items-center space-x-4">
                    {/* También nos aseguramos de que user.name exista antes de mostrarlo */}
                    <p className="text-gray-600">Hola, <span className="font-medium">{user.name || 'Usuario'}</span></p>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
