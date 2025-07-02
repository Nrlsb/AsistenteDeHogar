import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { registerUser, loginUser } from '../services/apiService';

// Creamos el contexto con un valor inicial más completo
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    // Estado para saber si una operación de autenticación está en curso
    const [loading, setLoading] = useState(false);

    // Al cargar la app, revisamos si hay un usuario en localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Fallo al leer usuario de localStorage", e);
            localStorage.removeItem('user');
        }
    }, []);

    // Función genérica para manejar el login y registro
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
            // Centralizamos el manejo de errores aquí
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

    // El valor del contexto ahora incluye los estados de carga y error
    const value = { user, error, loading, login, register, logout, clearError: () => setError(null) };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
