import { Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import api from './api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;