import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while fetching profile
  }

  console.log("Is Authenticated:", isAuthenticated);
  console.log("User Role:", role);
  console.log("Required Role:", requiredRole);

  // Extract the authority value from role object
  const userRole = role?.authority; 

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  // If a role is required and the user doesn't have it, redirect to login
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/auth/login" />;
  }

  return element; // Return the protected component if all checks pass
};

export default ProtectedRoute;
