import React from 'react';
// Importamos BrowserRouter para gestionar las rutas
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import AuthScreen from './components/auth/AuthScreen';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import TasksSection from './components/sections/TasksSection';
import ShoppingSection from './components/sections/ShoppingSection';
import ExpensesSection from './components/sections/ExpensesSection';
import MealsSection from './components/sections/MealsSection';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from './components/common/ConfirmationModal';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex justify-center items-center h-screen text-xl">Cargando...</div>;
    return user ? children : <Navigate to="/auth" replace />;
};

const AppLayout = () => {
    const { modalState, closeModal, handleConfirm } = useData();

    return (
        <>
            <ConfirmationModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                onConfirm={handleConfirm}
                title={modalState.title}
                message={modalState.message}
            />
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="p-4 sm:p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Navigation />
                        <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <DataProvider>
                {/* Envolvemos todo en el Router para que las rutas funcionen */}
                <Router>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                    <Routes>
                        <Route path="/auth" element={<AuthScreen />} />
                        <Route 
                            path="/" 
                            element={<PrivateRoute><AppLayout /></PrivateRoute>}
                        >
                            <Route index element={<Navigate to="/tasks" replace />} /> 
                            <Route path="tasks" element={<TasksSection />} />
                            <Route path="shopping" element={<ShoppingSection />} />
                            <Route path="expenses" element={<ExpensesSection />} />
                            <Route path="meals" element={<MealsSection />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </DataProvider>
        </AuthProvider>
    );
}

export default App;
