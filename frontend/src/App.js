import React from 'react';
// El 'BrowserRouter as Router' se ha eliminado de aquí
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import AuthScreen from './components/auth/AuthScreen';
import TasksSection from './components/sections/TasksSection';
import ShoppingSection from './components/sections/ShoppingSection';
import MealsSection from './components/sections/MealsSection';
import ExpensesSection from './components/sections/ExpensesSection';

const LoadingSpinner = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
        <p className="sr-only">Cargando...</p>
    </div>
);

function App() {
  const { user, isAuthReady } = useAuth();

  // Esta lógica de carga ahora funcionará como se espera
  if (!isAuthReady) {
    return <LoadingSpinner />;
  }

  return (
    // La etiqueta <Router> se ha eliminado, simplificando el componente
    <div className="App bg-gray-50 min-h-screen">
      {user ? (
        // Si hay usuario, muestra el panel principal
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
                <Route path="*" element={<Navigate to="/tasks" replace />} />
              </Routes>
            </main>
          </div>
        </>
      ) : (
        // Si no hay usuario, muestra la pantalla de autenticación
        <Routes>
          <Route path="*" element={<AuthScreen />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
