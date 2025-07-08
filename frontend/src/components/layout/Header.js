import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // FIX: Named import

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <h1 className="text-xl font-bold text-gray-800">Asistente de Hogar</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Hola, {user?.name}</span>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;
