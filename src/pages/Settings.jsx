import { Box, Typography, Paper, Switch, FormControlLabel, Alert, Button, Divider } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Configure your admin panel preferences
      </Alert>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Notifications
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          }
          label="Enable push notifications"
        />

        <Divider sx={{ my: 2 }} />

        <FormControlLabel
          control={
            <Switch
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
            />
          }
          label="Enable email alerts for critical events"
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Device Settings
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
            />
          }
          label="Enable automatic device sync"
        />
      </Paper>

      <Button variant="contained" onClick={handleSave}>
        Save Settings
      </Button>
    </Box>
  );
}
