import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Devices as DevicesIcon,
  Folder as FilesIcon,
  DesktopWindows as DevicesFilesIcon,
  Analytics as AnalyticsIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { APP_NAME } from '../../utils/constants';

const drawerWidth = 240;

const menuItems = [
  { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { title: 'Devices', path: '/devices', icon: <DevicesIcon /> },
  { title: 'Files', path: '/files', icon: <FilesIcon /> },
  { title: 'Devices & Files', path: '/devices-files', icon: <DevicesFilesIcon /> },
  { title: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
  { title: 'Users', path: '/users', icon: <UsersIcon /> },
  { title: 'Audit Logs', path: '/audit-logs', icon: <AnalyticsIcon /> },
  { title: 'Settings', path: '/settings', icon: <SettingsIcon /> }
];

export default function Sidebar({ drawerWidth: customWidth, mobileOpen, onDrawerToggle }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const width = customWidth || drawerWidth;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileOpen) {
      onDrawerToggle();
    }
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6" color="primary" fontWeight="bold">
          {APP_NAME}
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: width }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
