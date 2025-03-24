// src/auth/guards/PermissionGuard.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';

export const PermissionGuard = ({ permissions, requireAll = true, children, fallbackPath = "/unauthorized" }) => {
  const { isAuthenticated, loading } = useAuth();
  const { hasPermissions, hasAnyPermission } = usePermissions();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const hasAccess = requireAll 
    ? hasPermissions(permissions) 
    : hasAnyPermission(permissions);
    
  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  return children;
};