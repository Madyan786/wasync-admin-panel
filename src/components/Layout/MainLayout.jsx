import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const DRAWER_WIDTH = 240;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <TopBar onDrawerToggle={handleDrawerToggle} />
      
      <Sidebar 
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
