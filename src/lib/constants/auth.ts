// src/auth/constants/permissions.js
export const PERMISSIONS = {
    // User permissions
    VIEW_PROFILE: 'view:profile',
    EDIT_PROFILE: 'edit:profile',
    
    // Content permissions
    CREATE_CONTENT: 'create:content',
    EDIT_CONTENT: 'edit:content',
    DELETE_CONTENT: 'delete:content',
    VIEW_CONTENT: 'view:content',
    
    // Admin permissions
    VIEW_USERS: 'view:users',
    EDIT_USERS: 'edit:users',
    DELETE_USERS: 'delete:users',
    MANAGE_PERMISSIONS: 'manage:permissions',
    MANAGE_ROLES: 'manage:roles',
    
    // System settings
    VIEW_SETTINGS: 'view:settings',
    EDIT_SETTINGS: 'edit:settings',
  };
  
  // Helper function to check if a user has a specific permission
  export const hasPermission = (userPermissions, requiredPermission) => {
    if (!userPermissions || !Array.isArray(userPermissions)) {
      return false;
    }
    return userPermissions.includes(requiredPermission);
  };
  
  // Helper function to check if a user has ALL of the required permissions
  export const hasAllPermissions = (userPermissions, requiredPermissions) => {
    if (!userPermissions || !Array.isArray(userPermissions)) {
      return false;
    }
    return requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );
  };
  
  // Helper function to check if a user has ANY of the required permissions
  export const hasAnyPermission = (userPermissions, requiredPermissions) => {
    if (!userPermissions || !Array.isArray(userPermissions)) {
      return false;
    }
    return requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );
  };


  //---permission

  // src/auth/constants/roles.js

export const ROLES = {
  GUEST: 'guest',
  USER: 'user',
  EDITOR: 'editor',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

// Define permissions for each role
export const ROLE_PERMISSIONS = {
  [ROLES.GUEST]: [
    // Guests can only view public content
  ],
  [ROLES.USER]: [
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_CONTENT,
  ],
  [ROLES.EDITOR]: [
    // Editors inherit all user permissions
    ...ROLE_PERMISSIONS[ROLES.USER],
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
  ],
  [ROLES.ADMIN]: [
    // Admins inherit all editor permissions
    ...ROLE_PERMISSIONS[ROLES.EDITOR],
    PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.VIEW_SETTINGS,
  ],
  [ROLES.SUPER_ADMIN]: [
    // Super admins have all permissions
    ...Object.values(PERMISSIONS),
  ],
};

// Helper function to get permissions for a role
export const getPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

// Helper function to check if a user has a specific role
export const hasRole = (userRoles, requiredRole) => {
  if (!userRoles || !Array.isArray(userRoles)) {
    return false;
  }
  return userRoles.includes(requiredRole);
};