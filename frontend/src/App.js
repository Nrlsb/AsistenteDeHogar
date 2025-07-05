// frontend/src/App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';
import Spinner from './components/common/Spinner';
import ConfirmationModal from './components/common/ConfirmationModal';
import { useData } from './context/DataContext';
import AuthScreen from './components/auth/AuthScreen';
import TasksSection from './components/sections/TasksSection';
import ShoppingSection from './components/sections/ShoppingSection';
import ExpensesSection from './components/sections/ExpensesSection';
import MealsSection from './components/sections/MealsSection';
import Navigation from './components/layout/Navigation';
import { useState } from 'react';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { loading: dataLoading, modal, closeModal } = useData() || {};
  const [activeSection, setActiveSection] = useState('tasks');

  const renderSection = () => {
    switch (activeSection) {
      case 'tasks':
        return <TasksSection />;
      case 'shopping':
        return <ShoppingSection />;
      case 'expenses':
        return <ExpensesSection />;
      case 'meals':
        return <MealsSection />;
      default:
        return <TasksSection />;
    }
  };

  if (authLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                // El div principal ya no necesita ser flex, la navegación es fija
                <div>
                  <Navigation
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                  />
                  {/* CORRECCIÓN: El contenido principal ahora tiene un margen a la izquierda para no superponerse con la barra de navegación */}
                  <main className="ml-64 p-6">
                    {renderSection()}
                  </main>
                </div>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route path="/auth" element={!user ? <AuthScreen /> : <Navigate to="/" />} />
        </Routes>
      </div>
      <ToastContainer autoClose={3000} hideProgressBar />
      {modal && modal.isOpen && (
        <ConfirmationModal
          isOpen={modal.isOpen}
          onClose={closeModal}
          onConfirm={modal.onConfirm}
          title={modal.title}
          message={modal.message}
        />
      )}
      {(authLoading || dataLoading) && <Spinner />}
    </>
  );
}

export default App;
