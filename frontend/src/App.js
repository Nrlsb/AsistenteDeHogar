import React from 'react';
// El componente Router se ha quitado de este archivo
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

    return user ? children : <Navigate to="/auth" replace />;
};

// Componente que define el layout principal de la aplicación.
const AppLayout = () => (
    <DataProvider>
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
    </DataProvider>
);

function App() {
    // Ya no necesitamos el componente <Router> aquí
    return (
        <AuthProvider>
            <Routes>
                {/* Ruta pública para autenticación */}
                <Route path="/auth" element={<AuthScreen />} />

                {/* Rutas privadas anidadas dentro del layout principal */}
                <Route 
                    path="/" 
                    element={
                        <PrivateRoute>
                            <AppLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Navigate to="/tasks" replace />} /> 
                    <Route path="tasks" element={<TasksSection />} />
                    <Route path="shopping" element={<ShoppingSection />} />
                    <Route path="expenses" element={<ExpensesSection />} />
                    <Route path="meals" element={<MealsSection />} />
                </Route>

                {/* Cualquier otra ruta no definida redirige a la página principal */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
