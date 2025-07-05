import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { login, register, error, setError } = useAuth();

    const { name, email, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (error) {
            setError(null);
        }
        try {
            if (isLogin) {
                if (!email || !password) {
                    toast.warn('Por favor, completa todos los campos.');
                    return;
                }
                await login({ email, password });
            } else {
                if (!name || !email || !password) {
                    toast.warn('Por favor, completa todos los campos.');
                    return;
                }
                await register({ name, email, password });
            }
        } catch (err) {
            // El error ya se maneja y se muestra como un toast en AuthContext
            console.error(err);
        }
    };

    return (
        // Contenedor principal para centrar el contenido
        <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <form onSubmit={onSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={name}
                                onChange={onChange}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Tu nombre completo"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={onChange}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={onChange}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="********"
                        />
                    </div>
                    <div>
                        <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-blue-600 hover:text-blue-500">
                        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
