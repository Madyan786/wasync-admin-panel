import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getUploadStats } from '../../services/analyticsService';

export default function UploadChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stats = await getUploadStats(7);
      
      // Convert uploadsByDate to chart data
      const chartData = Object.entries(stats.uploadsByDate).map(([date, count]) => ({
        date,
        uploads: count
      }));

      setData(chartData);
    } catch (error) {
      console.error('Error fetching upload data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (data.length === 0) {
    return <Typography>No data available</Typography>;
  }

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="uploads" 
            stroke="#2196f3" 
            strokeWidth={2}
            dot={{ fill: '#2196f3' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
