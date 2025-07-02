import React, { useState } from 'react';
// Importamos el hook 'useAuth' para acceder al contexto de autenticación
import { useAuth } from '../../context/AuthContext';

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true); // Empezamos en la vista de Login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Añadimos estado para el nombre en el registro
    const [error, setError] = useState('');
    
    // Obtenemos las funciones de login y register del contexto
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiamos errores previos

        try {
            if (isLogin) {
                // Llamamos a la función de login del contexto
                await login({ email, password });
                // No es necesario redirigir aquí, el App.js lo manejará
            } else {
                // Llamamos a la función de register del contexto
                await register({ name, email, password });
            }
        } catch (err) {
            // Mostramos un mensaje de error más descriptivo desde la respuesta del backend
            const errorMessage = err.response?.data?.message || `Error al ${isLogin ? 'iniciar sesión' : 'registrarse'}.`;
            setError(errorMessage);
            console.error(err);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        // Limpiamos los campos al cambiar de formulario
        setEmail('');
        setPassword('');
        setName('');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Campo de nombre solo para el registro */}
                    {!isLogin && (
                         <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Nombre
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <div className="flex flex-col items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                        </button>
                        <button
                            type="button"
                            onClick={toggleForm}
                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 mt-4"
                        >
                            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthScreen;
