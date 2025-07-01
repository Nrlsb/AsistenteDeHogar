import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = isLogin 
                ? await apiService.login({ email, password })
                : await apiService.register({ email, password });
            
            if (data.token) {
                login(data.token);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-lg" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-lg" required />
                    </div>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700">
                        {isLogin ? 'Entrar' : 'Registrarse'}
                    </button>
                </form>
                <p className="text-center mt-4">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 hover:underline">
                        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                </p>
            </div>
        </div>
    );
};
