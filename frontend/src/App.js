// frontend/src/App.js
import { Routes, Route, Navigate } from 'react-router-dom'; // CORRECCIÓN: Ya no importamos BrowserRouter
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/layout/Header';
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
  // El modal puede ser undefined al principio, así que lo inicializamos de forma segura.
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

  // CORRECCIÓN: Eliminamos el <Router> que envolvía todo.
  // Ahora los componentes de rutas funcionan gracias al BrowserRouter que está en index.js
  return (
    <>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <div className="md:flex">
                  <Header />
                  <Navigation
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                  />
                  <main className="flex-1 p-4 md:p-10 md:ml-64">
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
      {/* Comprobamos que modal y modal.isOpen existan antes de renderizar */}
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
