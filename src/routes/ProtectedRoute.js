import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Hoặc có thể hiển thị một spinner
  }

  console.log("Is Authenticated:", isAuthenticated);
  console.log("Protected Element:", element);
  
  return isAuthenticated ? element : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
