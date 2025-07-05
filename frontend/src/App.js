import React, { useState } from 'react';
// Se elimina la importación de 'Router' porque ya no se utiliza.
// import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import AuthScreen from './components/auth/AuthScreen';
import Navigation from './components/layout/Navigation';
import TasksSection from './components/sections/TasksSection';
import ShoppingSection from './components/sections/ShoppingSection';
import MealsSection from './components/sections/MealsSection';
import ExpensesSection from './components/sections/ExpensesSection';
import ConfirmationModal from './components/common/ConfirmationModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const { user, loading } = useAuth();
    const [activeSection, setActiveSection] = useState('tasks');

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    const renderSection = () => {
        switch (activeSection) {
            case 'tasks':
                return <TasksSection />;
            case 'shopping':
                return <ShoppingSection />;
            case 'meals':
                return <MealsSection />;
            case 'expenses':
                return <ExpensesSection />;
            default:
                return <TasksSection />;
        }
    };

    return (
        // Se elimina el componente <Router> que envolvía la aplicación.
        <DataProvider>
            <div className="flex h-screen bg-gray-100">
                {user ? (
                    <>
                        <div className="w-64 flex-shrink-0">
                            <Navigation onNavigate={setActiveSection} activeSection={activeSection} />
                        </div>
                        <main className="flex-1 p-6 overflow-y-auto">
                            {renderSection()}
                        </main>
                    </>
                ) : (
                    <AuthScreen />
                )}
            </div>
            <ConfirmationModal />
            <ToastContainer
                position="bottom-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </DataProvider>
    );
}

export default App;
