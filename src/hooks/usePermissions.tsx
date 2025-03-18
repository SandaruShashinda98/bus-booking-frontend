// src/auth/hooks/usePermissions.js
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { permissionService } from '../services/permissionService';
import { hasPermission, hasAllPermissions, hasAnyPermission } from '../utils/permissionChecker';

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadPermissions = async () => {
      if (!isAuthenticated || !user?.id) {
        setPermissions([]);
        setRoles([]);
        setLoading(false);
        return;
      }
      
      try {
        // Fetch user permissions and roles
        const [userPermissions, userRoles] = await Promise.all([
          permissionService.getUserPermissions(user.id),
          permissionService.getUserRoles(user.id)
        ]);
        
        setPermissions(userPermissions);
        setRoles(userRoles);
      } catch (error) {
        console.error('Failed to load permissions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPermissions();
  }, [isAuthenticated, user]);
  
  return {
    permissions,
    roles,
    loading,
    hasPermission: (permission) => hasPermission(permissions, permission),
    hasPermissions: (requiredPermissions) => hasAllPermissions(permissions, requiredPermissions),
    hasAnyPermission: (requiredPermissions) => hasAnyPermission(permissions, requiredPermissions),
    hasRole: (role) => roles.includes(role),
  };
};