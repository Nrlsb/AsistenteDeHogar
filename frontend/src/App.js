import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './components/auth/AuthScreen';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import TasksSection from './components/sections/TasksSection';
import ShoppingSection from './components/sections/ShoppingSection';
import ExpensesSection from './components/sections/ExpensesSection';
import MealsSection from './components/sections/MealsSection';

const AppContent = () => {
    const [activeTab, setActiveTab] = React.useState('tasks');
    const { logout } = useAuth();

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'tasks': return <TasksSection />;
            case 'shopping': return <ShoppingSection />;
            case 'expenses': return <ExpensesSection />;
            case 'meals': return <MealsSection />;
            default: return <TasksSection />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
                <Header onLogout={logout} />
                <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
                <main>
                    {renderActiveTab()}
                </main>
            </div>
        </div>
    );
}

const Main = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <AppContent /> : <AuthScreen />;
}

export default function App() {
    return (
        <AuthProvider>
            <Main />
        </AuthProvider>
    );
}
