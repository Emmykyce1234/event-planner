import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import AuthProvider, { useAuth } from '@/contexts/AuthContext';
    import LoginPage from '@/pages/LoginPage';
    import SignUpPage from '@/pages/SignUpPage';
    import DashboardPage from '@/pages/DashboardPage';
    import EventsPage from '@/pages/EventsPage';
    import Navbar from '@/components/Navbar';
    import ProtectedRoute from '@/components/ProtectedRoute';

    function AppContent() {
      const { user } = useAuth();

      return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-slate-900 to-background text-foreground">
          <Router>
            {user && <Navbar />}
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/events" 
                  element={
                    <ProtectedRoute>
                      <EventsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
              </Routes>
            </main>
          </Router>
          <Toaster />
        </div>
      );
    }

    function App() {
      return (
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      );
    }

    export default App;