import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/apiService';

// Objeto con el estado por defecto para el contexto de autenticación.
// Esto previene que la aplicación se rompa.
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
                // La función setAuthToken no es necesaria gracias al interceptor de Axios
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
            setUser(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await api.register(userData);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrarse');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        // La función setAuthToken no es necesaria aquí tampoco.
    };

    const value = { user, token, login, register, logout, loading, error };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
