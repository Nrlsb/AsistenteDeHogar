import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Para la carga inicial de la página
    const [authLoading, setAuthLoading] = useState(false); // Para las acciones de login/registro
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Usamos useCallback para evitar que navigate cause re-renders innecesarios
    const memoizedNavigate = useCallback(navigate, []);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const parsedUser = JSON.parse(userStr);
                setUser(parsedUser);
            } catch (e) {
                console.error("Fallo al parsear el usuario desde localStorage", e);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (userData) => {
        setAuthLoading(true);
        setError(null);
        try {
            const { data } = await api.loginUser(userData);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            memoizedNavigate('/tasks');
        } catch (err) {
            console.error("Fallo el inicio de sesión:", err); // Registramos el error completo en consola
            setError(err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.');
        } finally {
            setAuthLoading(false);
        }
    };

    const register = async (userData) => {
        setAuthLoading(true);
        setError(null);
        try {
            const { data } = await api.registerUser(userData);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            memoizedNavigate('/tasks');
        } catch (err) {
            console.error("Fallo el registro:", err); // Registramos el error completo en consola
            setError(err.response?.data?.message || 'Error al registrarse. Intente de nuevo.');
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        memoizedNavigate('/auth');
    };

    return (
        <AuthContext.Provider value={{ user, loading, authLoading, error, login, register, logout, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
