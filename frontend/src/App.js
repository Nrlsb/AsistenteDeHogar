import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import AuthScreen from './components/auth/AuthScreen';
import TasksSection from './components/sections/TasksSection';
import ShoppingSection from './components/sections/ShoppingSection';
import MealsSection from './components/sections/MealsSection';
import ExpensesSection from './components/sections/ExpensesSection';

// Componente para mostrar un indicador de carga mientras se verifica la autenticación
const LoadingSpinner = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
        <p className="sr-only">Cargando...</p>
    </div>
);

function App() {
  // Obtenemos el usuario y el nuevo estado 'isAuthReady' del contexto
  const { user, isAuthReady } = useAuth();

  // LA CORRECCIÓN CLAVE:
  // Si aún no hemos verificado si hay un usuario en localStorage, mostramos
  // el indicador de carga. Esto previene que la app intente renderizar el panel
  // principal prematuramente, evitando el error.
  if (!isAuthReady) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App bg-gray-50 min-h-screen">
        {user ? (
          // Si el usuario existe, mostramos el panel principal
          <>
            <Header />
            <div className="flex flex-col md:flex-row">
              <Navigation />
              <main className="flex-grow p-4">
                <Routes>
                  <Route path="/tasks" element={<TasksSection />} />
                  <Route path="/shopping" element={<ShoppingSection />} />
                  <Route path="/meals" element={<MealsSection />} />
                  <Route path="/expenses" element={<ExpensesSection />} />
                  {/* Redirigimos cualquier otra ruta a /tasks por defecto */}
                  <Route path="*" element={<Navigate to="/tasks" replace />} />
                </Routes>
              </main>
            </div>
          </>
        ) : (
          // Si no hay usuario, cualquier ruta lleva a la pantalla de autenticación
          <Routes>
            <Route path="*" element={<AuthScreen />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
