import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import {
  Devices as DevicesIcon,
  CloudUpload as UploadIcon,
  Storage as StorageIcon,
  CheckCircle as OnlineIcon
} from '@mui/icons-material';
import StatCard from '../components/Dashboard/StatCard';
import UploadChart from '../components/Dashboard/UploadChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { getAnalyticsSummary } from '../services/analyticsService';
import { formatFileSize } from '../utils/formatters';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalDevices: 0,
    onlineDevices: 0,
    totalUploads: 0,
    totalStorage: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const analytics = await getAnalyticsSummary();
      
      setStats({
        totalDevices: analytics.devices.totalDevices || 0,
        onlineDevices: analytics.devices.onlineDevices || 0,
        totalUploads: analytics.uploads.totalUploads || 0,
        totalStorage: analytics.uploads.totalSize || 0
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
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
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Devices"
            value={stats.totalDevices}
            icon={<DevicesIcon />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Online Devices"
            value={stats.onlineDevices}
            icon={<OnlineIcon />}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Uploads"
            value={stats.totalUploads}
            icon={<UploadIcon />}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Storage Used"
            value={formatFileSize(stats.totalStorage)}
            icon={<StorageIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Upload Trends (Last 7 Days)
            </Typography>
            <UploadChart />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <RecentActivity />
        </Grid>
      </Grid>
    </Box>
  );
}
