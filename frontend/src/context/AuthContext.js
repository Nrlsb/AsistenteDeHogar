import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { registerUser, loginUser } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // NUEVO ESTADO: Rastrea si la verificación inicial de autenticación ha terminado.
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Este efecto se ejecuta solo una vez, cuando la aplicación se carga por primera vez.
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
            // Marcamos la verificación inicial como completa, para que App.js pueda renderizar.
            setIsAuthReady(true);
        }
    }, []);

    // Función genérica para manejar tanto el login como el registro
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

    // Exponemos el nuevo estado 'isAuthReady' en el valor del contexto
    const value = { user, error, loading, isAuthReady, login, register, logout, clearError: () => setError(null) };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
