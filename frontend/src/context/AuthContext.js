import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/apiService'; // Cambiado a importación por defecto
import { toast } from 'react-toastify';

const defaultAuthContext = {
    user: null,
    token: null,
    login: async () => {},
    register: async () => {},
    logout: () => {},
    loading: true,
    error: null,
    setError: () => {},
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
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setError(null);
            toast.success('¡Bienvenido de nuevo!');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
            setError(errorMessage);
            toast.error(errorMessage);
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

    const value = { user, token, login, register, logout, loading, error, setError };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
