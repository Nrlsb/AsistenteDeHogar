import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext'; // FIX: Corrected import
import { DataProvider } from './context/DataContext';
import AuthScreen from './components/auth/AuthScreen';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import TasksSection from './components/sections/TasksSection';
import ShoppingSection from './components/sections/ShoppingSection';
import MealsSection from './components/sections/MealsSection';
import ExpensesSection from './components/sections/ExpensesSection';
import { Toaster } from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Toaster position="top-center" reverseOrder={false} />
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Routes>
              <Route path="/auth" element={<AuthScreen />} />
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <Header />
                    <div className="flex flex-1">
                      <Navigation />
                      <main className="flex-1 p-4 md:p-6">
                        <Routes>
                          <Route path="/" element={<TasksSection />} />
                          <Route path="/shopping" element={<ShoppingSection />} />
                          <Route path="/meals" element={<MealsSection />} />
                          <Route path="/expenses" element={<ExpensesSection />} />
                        </Routes>
                      </main>
                    </div>
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
