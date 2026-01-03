import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isFirstTimeLogin } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If it's first time login, redirect to change password page
  if (isFirstTimeLogin && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  // If user already changed password, don't allow access to change password page
  if (!isFirstTimeLogin && location.pathname === '/change-password') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;