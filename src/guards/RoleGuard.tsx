// src/auth/guards/RoleGuard.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';

export const RoleGuard = ({ roles, children, fallbackPath = "/unauthorized" }) => {
  const { isAuthenticated, loading } = useAuth();
  const { hasRole } = usePermissions();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has any of the required roles
  const hasAccess = Array.isArray(roles)
    ? roles.some(role => hasRole(role))
    : hasRole(roles);
    
  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  return children;
};