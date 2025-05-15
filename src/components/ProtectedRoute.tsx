import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { RootState } from '../store';

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;
  const token = localStorage.getItem('token');

  // If not authenticated and no token, redirect to login
  if (!isAuthenticated && !token) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // Otherwise, render the protected route
  return <Outlet />;
};

export default ProtectedRoute; 