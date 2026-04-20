import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { getAllDevices } from '../../services/deviceService';
import { formatDeviceStatus } from '../../utils/formatters';

export default function DeviceMap() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const devicesData = await getAllDevices();
      setDevices(devicesData);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const onlineDevices = devices.filter(d => formatDeviceStatus(d.lastSeen) === 'online');
  const offlineDevices = devices.filter(d => formatDeviceStatus(d.lastSeen) === 'offline');

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Device Status Overview
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Chip 
          label={`${onlineDevices.length} Online`} 
          color="success" 
          sx={{ fontSize: '1rem', px: 2 }}
        />
        <Chip 
          label={`${offlineDevices.length} Offline`} 
          color="default" 
          sx={{ fontSize: '1rem', px: 2 }}
        />
        <Chip 
          label={`${devices.length} Total`} 
          color="primary" 
          sx={{ fontSize: '1rem', px: 2 }}
        />
      </Box>

      <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
        {devices.map((device) => {
          const status = formatDeviceStatus(device.lastSeen);
          return (
            <Box
              key={device.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                mb: 1,
                backgroundColor: status === 'online' ? '#e8f5e9' : '#f5f5f5',
                borderRadius: 1,
                border: '1px solid',
                borderColor: status === 'online' ? '#4caf50' : '#e0e0e0'
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {device.name || 'Unknown Device'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {device.userName || device.userId || 'No user'}
                </Typography>
              </Box>
              <Chip
                label={status}
                color={status === 'online' ? 'success' : 'default'}
                size="small"
              />
            </Box>
          );
        })}
      </Box>

      {devices.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No devices connected
        </Typography>
      )}
    </Paper>
  );
}
