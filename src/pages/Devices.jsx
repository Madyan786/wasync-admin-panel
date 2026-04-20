import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress, Checkbox, AppBar, Toolbar } from '@mui/material';
import { Delete as DeleteIcon, PowerOff as PowerOffIcon, PowerSettingsNew as PowerOnIcon, Sync as SyncIcon, SelectAll as SelectAllIcon, Clear as ClearIcon } from '@mui/icons-material';
import { getAllDevices, subscribeToDevices, toggleDeviceStatus, deleteDevice, forceSyncDevice, batchToggleDevices, batchDeleteDevices } from '../services/deviceService';
import { formatDeviceStatus, formatRelativeTime, formatDate } from '../utils/formatters';
import { toast } from 'react-toastify';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, deviceId: null });
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [batchActionDialog, setBatchActionDialog] = useState({ open: false, action: null });

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToDevices((devicesData) => {
      setDevices(devicesData);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const devicesData = await getAllDevices();
      setDevices(devicesData);
    } catch (err) {
      setError('Failed to load devices');
      toast.error('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (deviceId, currentStatus) => {
    try {
      await toggleDeviceStatus(deviceId, !currentStatus);
      toast.success(`Device ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      fetchDevices();
    } catch (err) {
      toast.error('Failed to update device status');
    }
  };

  const handleForceSync = async (deviceId) => {
    try {
      await forceSyncDevice(deviceId);
      toast.success('Sync requested successfully');
    } catch (err) {
      toast.error('Failed to request sync');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDevice(deleteDialog.deviceId);
      toast.success('Device deleted successfully');
      setDeleteDialog({ open: false, deviceId: null });
      fetchDevices();
    } catch (err) {
      toast.error('Failed to delete device');
    }
  };

  const toggleSelectDevice = (deviceId) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId) 
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const selectAllDevices = () => {
    if (selectedDevices.length === devices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(devices.map(d => d.id));
    }
  };

  const handleBatchAction = async () => {
    try {
      if (batchActionDialog.action === 'delete') {
        await batchDeleteDevices(selectedDevices);
        toast.success(`${selectedDevices.length} devices deleted successfully`);
      } else if (batchActionDialog.action === 'enable') {
        await batchToggleDevices(selectedDevices, true);
        toast.success(`${selectedDevices.length} devices enabled successfully`);
      } else if (batchActionDialog.action === 'disable') {
        await batchToggleDevices(selectedDevices, false);
        toast.success(`${selectedDevices.length} devices disabled successfully`);
      }
      setBatchActionDialog({ open: false, action: null });
      setSelectedDevices([]);
      fetchDevices();
    } catch (err) {
      toast.error('Failed to perform batch action');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Device Management
        </Typography>
        
        {selectedDevices.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => setBatchActionDialog({ open: true, action: 'enable' })}
            >
              Enable Selected ({selectedDevices.length})
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => setBatchActionDialog({ open: true, action: 'disable' })}
            >
              Disable Selected ({selectedDevices.length})
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setBatchActionDialog({ open: true, action: 'delete' })}
            >
              Delete Selected ({selectedDevices.length})
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSelectedDevices([])}
            >
              Clear Selection
            </Button>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<SelectAllIcon />}
          onClick={selectAllDevices}
        >
          {selectedDevices.length === devices.length ? 'Deselect All' : 'Select All'}
        </Button>
        {selectedDevices.length > 0 && (
          <Typography sx={{ alignSelf: 'center' }}>
            {selectedDevices.length} of {devices.length} selected
          </Typography>
        )}
      </Box>

      <Grid container spacing={3}>
        {devices.map((device) => {
          const status = formatDeviceStatus(device.lastSeen);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={device.id}>
              <Card sx={{ position: 'relative' }}>
                <Checkbox
                  checked={selectedDevices.includes(device.id)}
                  onChange={() => toggleSelectDevice(device.id)}
                  sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{device.name || 'Unknown Device'}</Typography>
                    <Chip
                      label={status}
                      color={status === 'online' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    User: {device.userName || device.userId || 'N/A'}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    OS: {device.os || 'N/A'}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Last Seen: {formatRelativeTime(device.lastSeen)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Uploads: {device.uploadCount || 0}
                  </Typography>
                </CardContent>

                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => handleToggleStatus(device.id, device.enabled)}
                    color={device.enabled ? 'warning' : 'success'}
                  >
                    {device.enabled ? <PowerOffIcon /> : <PowerOnIcon />}
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => handleForceSync(device.id)}
                  >
                    <SyncIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => setDeleteDialog({ open: true, deviceId: device.id })}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {devices.length === 0 && !loading && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No devices found
        </Typography>
      )}

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, deviceId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this device? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, deviceId: null })}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={batchActionDialog.open} onClose={() => setBatchActionDialog({ open: false, action: null })}>
        <DialogTitle>Confirm Batch Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {batchActionDialog.action} {selectedDevices.length} device(s)? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBatchActionDialog({ open: false, action: null })}>Cancel</Button>
          <Button 
            onClick={handleBatchAction} 
            color={batchActionDialog.action === 'delete' ? 'error' : 'primary'} 
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
