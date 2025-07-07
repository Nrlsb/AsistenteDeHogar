// nrlsb/asistentedehogar/AsistenteDeHogar-ab8ced350d0a76f79702cd5ab21b0004078dffb3/frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import * as api from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    // --- CAMBIO ---
                    // Ya no necesitamos pasar el token a getMe().
                    // El interceptor de Axios lo hace automáticamente.
                    const userData = await api.getMe();
                    setUser(userData);
                } catch (err) {
                    console.error("Error fetching user:", err);
                    setError('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
                    logout(); // Limpia el token inválido
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            setError(null);
            // --- CAMBIO ---
            // La función de login en apiService ahora también se encarga
            // de guardar el token en localStorage.
            const data = await api.login(email, password);
            setToken(data.token);
            toast.success('¡Bienvenido de nuevo!');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        }
    };

    const register = async (name, email, password) => {
        try {
            setError(null);
            // --- CAMBIO ---
            // Lo mismo para el registro.
            const data = await api.register(name, email, password);
            setToken(data.token);
            toast.success('¡Registro exitoso!');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error en el registro';
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

    const value = {
        user,
        token,
        login,
        register,
        logout,
        loading,
        error,
        setError
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
