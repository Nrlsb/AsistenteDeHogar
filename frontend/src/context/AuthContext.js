import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { registerUser, loginUser } from '../services/apiService';

// 1. Se crea un valor por defecto para el contexto.
// Esto previene que la aplicación se rompa si un componente intenta
// usar el contexto sin que un Provider esté disponible.
const defaultAuthContext = {
    user: null,
    error: null,
    loading: false,
    isAuthReady: false, // Por defecto es 'false' para que la app muestre el loader
    login: () => Promise.reject(new Error("AuthProvider no encontrado")),
    register: () => Promise.reject(new Error("AuthProvider no encontrado")),
    logout: () => { throw new Error("AuthProvider no encontrado"); },
    clearError: () => {}
};

// 2. Se usa el valor por defecto al crear el contexto.
const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Este efecto se ejecuta solo una vez para verificar si hay un usuario en localStorage.
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Fallo al leer usuario de localStorage", e);
            localStorage.removeItem('user');
        } finally {
            // Se marca la verificación como completa para que App.js pueda renderizar.
            setIsAuthReady(true);
        }
    }, []);

    const handleAuth = useCallback(async (authPromise) => {
        setError(null);
        setLoading(true);
        try {
            const response = await authPromise;
            const userData = response.data;
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error de red. Por favor, inténtalo de nuevo.';
            setError(errorMessage);
            console.error("Error de autenticación:", err);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback((credentials) => {
        return handleAuth(loginUser(credentials));
    }, [handleAuth]);

    const register = useCallback((userData) => {
        return handleAuth(registerUser(userData));
    }, [handleAuth]);

    const logout = useCallback(() => {
        localStorage.removeItem('user');
        setUser(null);
    }, []);

    const value = { user, error, loading, isAuthReady, login, register, logout, clearError: () => setError(null) };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. El hook ahora simplemente devuelve el contexto.
// Ya no necesita una comprobación extra porque siempre habrá un valor por defecto.
export const useAuth = () => {
    return useContext(AuthContext);
};
