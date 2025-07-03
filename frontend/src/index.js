import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Al mover el Router aquí, nos aseguramos de que toda la app tenga acceso al contexto de enrutamiento */}
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
