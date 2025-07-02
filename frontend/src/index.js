import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom'; // 1. Importamos el Router aquí

const root = ReactDOM.createRoot(document.getElementById('root'));

// 2. Esta es la estructura correcta y robusta para una aplicación React.
// Se asegura de que tanto el contexto de autenticación como las rutas
// estén disponibles para toda la aplicación desde el nivel más alto.
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
