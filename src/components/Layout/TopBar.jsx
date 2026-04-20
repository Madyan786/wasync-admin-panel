import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function TopBar({ onDrawerToggle }) {
  const { currentUser } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - 240px)` },
        ml: { sm: '240px' },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          WASync Admin Panel
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            {currentUser?.email || 'Admin'}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
