import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/apiService';
import { toast } from 'react-toastify'; // Importamos toast para las notificaciones

const defaultAuthContext = {
    user: null,
    token: null,
    login: async () => {},
    register: async () => {},
    logout: () => {},
    loading: true,
    error: null,
};

const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyUser = async () => {
            if (token) {
                try {
                    const { data } = await api.getMe();
                    setUser(data);
                } catch (err) {
                    console.error("Error de autenticación, token inválido.");
                    // Limpiamos el estado si el token no es válido
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        verifyUser();
    }, [token]);

    const login = async (userData) => {
        try {
            const { data } = await api.login(userData);
            // La única responsabilidad de login es obtener y establecer el token.
            localStorage.setItem('token', data.token);
            setToken(data.token); // Esto activará el useEffect para obtener los datos del usuario
            setError(null);
            toast.success('¡Bienvenido de nuevo!');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
            setError(errorMessage);
            toast.error(errorMessage); // Mostramos el error con una notificación
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await api.register(userData);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setError(null);
            toast.success('¡Registro exitoso! Bienvenido.');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al registrarse';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.info('Has cerrado sesión.');
    };

    const value = { user, token, login, register, logout, loading, error };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
