import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import AuthScreen from './components/auth/AuthScreen';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import TasksSection from './components/sections/TasksSection';
import ShoppingSection from './components/sections/ShoppingSection';
import ExpensesSection from './components/sections/ExpensesSection';
import MealsSection from './components/sections/MealsSection';

// Componente para proteger rutas que solo usuarios logueados pueden ver
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl">Cargando...</div>;
    }

    // Si no hay usuario, redirige a la pantalla de autenticación
    return user ? children : <Navigate to="/auth" />;
};

// Componente que define el layout principal de la aplicación (Header, Navegación, etc.)
const AppLayout = () => (
    <DataProvider>
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="p-4 sm:p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Navigation ya no necesita props, es autónoma */}
                    <Navigation />
                    <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow">
                        <Routes>
                            <Route path="/tasks" element={<TasksSection />} />
                            <Route path="/shopping" element={<ShoppingSection />} />
                            <Route path="/expenses" element={<ExpensesSection />} />
                            <Route path="/meals" element={<MealsSection />} />
                            {/* Cualquier otra ruta dentro de la app redirige a /tasks */}
                            <Route path="*" element={<Navigate to="/tasks" replace />} />
                        </Routes>
                    </div>
                </div>
            </main>
        </div>
    </DataProvider>
);

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* La ruta de autenticación es pública */}
                    <Route path="/auth" element={<AuthScreen />} />

                    {/* Todas las demás rutas ("/*") están protegidas por PrivateRoute */}
                    <Route 
                        path="/*"
                        element={
                            <PrivateRoute>
                                <AppLayout />
                            </PrivateRoute>
                        } 
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
