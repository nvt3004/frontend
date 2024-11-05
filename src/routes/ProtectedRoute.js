import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLocation } from "react-router-dom";

const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, role, loading, profile } = useAuth();
  const location = useLocation(); 

  const from = location.state?.from || "/home";

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("Is Authenticated:", isAuthenticated);
  console.log("User Role:", role);
  console.log("Required Role:", requiredRole);
  console.log("Profile:", profile);
  console.log('Đường dẫn trước đó'+from)

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} />;
  }

  if (requiredRole) {
    const requiredRolesArray = requiredRole.split(",").map(role => role.trim()); 
    if (!requiredRolesArray.includes(role)) {
      return <Navigate to="/auth/login" state={{ from: location.pathname }} />; 
    }
  }

  return element;
};

export default ProtectedRoute;
