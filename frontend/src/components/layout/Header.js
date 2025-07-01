import React from 'react';

export default function Header({ onLogout }) {
    return (
        <header className="mb-6 md:mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                    <i className="fas fa-house-user text-indigo-600 mr-3"></i> Asistente del Hogar
                </h1>
                <p className="text-gray-600 mt-1">Tu centro de control para organizar el día a día.</p>
            </div>
            <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                <i className="fas fa-sign-out-alt mr-2"></i>Cerrar Sesión
            </button>
        </header>
    );
}
