
    import React from 'react';
    import { Navigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext';

    const ProtectedRoute = ({ children }) => {
      const { user, loading } = useAuth();

      if (loading) {
        return <div className="flex justify-center items-center h-screen"><p className="text-white text-xl">Loading...</p></div>;
      }

      if (!user) {
        return <Navigate to="/login" replace />;
      }

      return children;
    };

    export default ProtectedRoute;
  