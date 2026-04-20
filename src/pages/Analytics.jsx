import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, Button, ButtonGroup } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getUploadStats, getDeviceActivity, getStorageGrowth } from '../services/analyticsService';
import { formatFileSize } from '../utils/formatters';
import { CHART_COLORS } from '../utils/constants';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState(7);
  const [uploadStats, setUploadStats] = useState(null);
  const [deviceActivity, setDeviceActivity] = useState(null);
  const [storageGrowth, setStorageGrowth] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [uploads, devices, growth] = await Promise.all([
        getUploadStats(timeRange),
        getDeviceActivity(),
        getStorageGrowth(timeRange)
      ]);

      setUploadStats(uploads);
      setDeviceActivity(devices);
      setStorageGrowth(growth);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fileTypeData = uploadStats ? Object.entries(uploadStats.uploadsByType).map(([name, value]) => ({
    name,
    value
  })) : [];

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
          Analytics
        </Typography>

        <ButtonGroup variant="outlined">
          <Button 
            onClick={() => setTimeRange(7)} 
            variant={timeRange === 7 ? 'contained' : 'outlined'}
          >
            7 Days
          </Button>
          <Button 
            onClick={() => setTimeRange(30)} 
            variant={timeRange === 30 ? 'contained' : 'outlined'}
          >
            30 Days
          </Button>
        </ButtonGroup>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Device Activity
            </Typography>
            
            {deviceActivity && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Total Devices: {deviceActivity.totalDevices}
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                  Online: {deviceActivity.onlineDevices}
                </Typography>
                <Typography variant="body2" color="error.main">
                  Offline: {deviceActivity.offlineDevices}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Upload Summary
            </Typography>
            
            {uploadStats && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Total Uploads: {uploadStats.totalUploads}
                </Typography>
                <Typography variant="body2">
                  Total Size: {formatFileSize(uploadStats.totalSize)}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Upload Trends
            </Typography>
            
            {uploadStats && Object.keys(uploadStats.uploadsByDate).length > 0 ? (
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={Object.entries(uploadStats.uploadsByDate).map(([date, count]) => ({
                    date,
                    uploads: count
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="uploads" fill="#2196f3" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Typography color="text.secondary">No data available</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              File Type Distribution
            </Typography>
            
            {fileTypeData.length > 0 ? (
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={fileTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fileTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Typography color="text.secondary">No data available</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
