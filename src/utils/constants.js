// App name
export const APP_NAME = 'WASync Admin Panel';

// Admin roles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  VIEWER: 'viewer'
};

// Device status
export const DEVICE_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline'
};

// File types
export const FILE_TYPES = {
  PDF: 'pdf',
  DOCUMENT: 'document',
  SPREADSHEET: 'spreadsheet',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  ARCHIVE: 'archive',
  OTHER: 'other'
};

// Navigation menu items
export const MENU_ITEMS = [
  { title: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
  { title: 'Devices', path: '/devices', icon: 'Devices' },
  { title: 'Files', path: '/files', icon: 'Folder' },
  { title: 'Analytics', path: '/analytics', icon: 'Analytics' },
  { title: 'Users', path: '/users', icon: 'People' },
  { title: 'Settings', path: '/settings', icon: 'Settings' }
];

// Pagination
export const ITEMS_PER_PAGE = 10;

// Chart colors
export const CHART_COLORS = [
  '#2196f3',
  '#4caf50',
  '#ff9800',
  '#f44336',
  '#9c27b0',
  '#00bcd4',
  '#ff5722',
  '#607d8b'
];

// Time ranges for analytics
export const TIME_RANGES = {
  DAY: '24h',
  WEEK: '7d',
  MONTH: '30d',
  YEAR: '1y'
};

// Audit event types
export const AUDIT_EVENTS = {
  DEVICE_ENABLE: 'device_enable',
  DEVICE_DISABLE: 'device_disable',
  DEVICE_DELETE: 'device_delete',
  FILE_DELETE: 'file_delete',
  FILE_DOWNLOAD: 'file_download',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  SETTINGS_UPDATE: 'settings_update'
};
