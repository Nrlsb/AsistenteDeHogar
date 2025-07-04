// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/apiService'; // CORRECCIÓN: Importamos el objeto completo

// Obtener usuario del localStorage
const user = JSON.parse(localStorage.getItem('user'));

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: user ? user : null,
    loading: false,
    error: null,
  });

  // No necesitamos un useEffect para comprobar el login,
  // ya que el estado inicial se establece desde localStorage.
  // La validación del token se hace en cada petición a la API a través del middleware.

  const register = async (userData) => {
    setAuthState({ ...authState, loading: true });
    try {
      const user = await apiService.register(userData);
      setAuthState({ user, loading: false, error: null });
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      setAuthState({ user: null, loading: false, error: message });
      throw new Error(message); // Lanzamos el error para que el componente lo atrape
    }
  };

  const login = async (userData) => {
    setAuthState({ ...authState, loading: true });
    try {
      const user = await apiService.login(userData);
      setAuthState({ user, loading: false, error: null });
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      setAuthState({ user: null, loading: false, error: message });
      throw new Error(message);
    }
  };

  const logout = () => {
    apiService.logout();
    setAuthState({ user: null, loading: false, error: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
