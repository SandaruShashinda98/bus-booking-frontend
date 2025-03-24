// src/auth/services/permissionService.js
import api from '@/api/client';
import { ROLE_PERMISSIONS } from '../lib/constants/auth';


export const permissionService = {
  async getUserPermissions(userId) {
    try {
      const response = await api.get(`/users/${userId}/permissions`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user permissions:', error);
      return [];
    }
  },
  
  async getUserRoles(userId) {
    try {
      const response = await api.get(`/users/${userId}/roles`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user roles:', error);
      return [];
    }
  },
  
  // Calculate permissions based on user's roles
  getPermissionsFromRoles(roles) {
    let permissions = [];
    
    roles.forEach(role => {
      const rolePermissions = ROLE_PERMISSIONS[role] || [];
      permissions = [...permissions, ...rolePermissions];
    });
    
    // Remove duplicates
    return [...new Set(permissions)];
  },
  
  // Check if user has specific permission
  hasPermission(userPermissions, permission) {
    return userPermissions.includes(permission);
  },
  
  // Check if user has all required permissions
  hasAllPermissions(userPermissions, permissions) {
    return permissions.every(permission => userPermissions.includes(permission));
  },
  
  // Check if user has any of the specified permissions
  hasAnyPermission(userPermissions, permissions) {
    return permissions.some(permission => userPermissions.includes(permission));
  }
};