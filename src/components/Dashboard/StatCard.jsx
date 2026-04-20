import { Paper, Box, Typography } from '@mui/material';

export default function StatCard({ title, value, icon, color = 'primary' }) {
  const colorMap = {
    primary: { bg: '#e3f2fd', color: '#1976d2' },
    success: { bg: '#e8f5e9', color: '#2e7d32' },
    info: { bg: '#e1f5fe', color: '#0288d1' },
    warning: { bg: '#fff3e0', color: '#f57c00' }
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        }
      }}
    >
      <Box
        sx={{
          backgroundColor: colors.bg,
          borderRadius: 2,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.color
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}
