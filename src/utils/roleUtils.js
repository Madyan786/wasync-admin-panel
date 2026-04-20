import { ROLES } from './constants';

// Check if user has required role
export const hasRole = (userRole, requiredRoles) => {
  if (!userRole) return false;
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  return requiredRoles.includes(userRole);
};

// Check if user can perform action based on role
export const canPerformAction = (userRole, action) => {
  const permissions = {
    [ROLES.SUPER_ADMIN]: ['all'],
    [ROLES.ADMIN]: [
      'view_devices',
      'edit_devices',
      'delete_devices',
      'view_files',
      'download_files',
      'delete_files',
      'view_analytics',
      'view_users',
      'view_audit_logs'
    ],
    [ROLES.VIEWER]: [
      'view_devices',
      'view_files',
      'download_files',
      'view_analytics'
    ]
  };

  const userPermissions = permissions[userRole] || [];
  
  if (userPermissions.includes('all')) return true;
  return userPermissions.includes(action);
};

// Filter menu items based on user role
export const getAccessibleMenuItems = (userRole, allMenuItems) => {
  const menuPermissions = {
    [ROLES.SUPER_ADMIN]: ['all'],
    [ROLES.ADMIN]: ['dashboard', 'devices', 'files', 'analytics', 'users', 'audit-logs', 'settings'],
    [ROLES.VIEWER]: ['dashboard', 'devices', 'files', 'analytics']
  };

  const allowedMenus = menuPermissions[userRole] || [];
  
  if (allowedMenus.includes('all')) return allMenuItems;
  
  return allMenuItems.filter(item => allowedMenus.includes(item.path.substring(1)));
};

// Role-based component wrapper
export const RoleGuard = ({ userRole, allowedRoles, children, fallback = null }) => {
  if (!userRole || !hasRole(userRole, allowedRoles)) {
    return fallback;
  }
  return children;
};
