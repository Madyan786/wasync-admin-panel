import { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { getUploadStats } from '../../services/analyticsService';

export default function ActivityHeatmap() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      const stats = await getUploadStats(30);
      
      // Generate heatmap data (7 days x 24 hours)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const hours = Array.from({ length: 24 }, (_, i) => i);
      
      const data = [];
      days.forEach((day, dayIndex) => {
        hours.forEach(hour => {
          data.push({
            day,
            hour,
            dayIndex,
            value: Math.floor(Math.random() * 10) // Replace with actual data
          });
        });
      });
      
      setHeatmapData(data);
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (value) => {
    if (value === 0) return '#f5f5f5';
    if (value < 3) return '#c8e6c9';
    if (value < 6) return '#81c784';
    if (value < 9) return '#4caf50';
    return '#2e7d32';
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Device Activity Heatmap
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', mb: 1, ml: 6 }}>
          {Array.from({ length: 24 }, (_, i) => (
            <Box
              key={i}
              sx={{
                width: 30,
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'text.secondary'
              }}
            >
              {i}
            </Box>
          ))}
        </Box>

        {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
          <Box key={dayIndex} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box sx={{ width: 50, fontSize: '0.875rem', color: 'text.secondary' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex]}
            </Box>
            <Box sx={{ display: 'flex' }}>
              {Array.from({ length: 24 }, (_, hourIndex) => {
                const cell = heatmapData.find(
                  d => d.dayIndex === dayIndex && d.hour === hourIndex
                );
                return (
                  <Box
                    key={hourIndex}
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: getColor(cell?.value || 0),
                      m: 0.25,
                      borderRadius: 0.5,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.2)',
                      }
                    }}
                    title={`Day ${dayIndex}, Hour ${hourIndex}: ${cell?.value || 0} activities`}
                  />
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
        <Typography variant="caption" color="text.secondary">Less</Typography>
        <Box sx={{ width: 20, height: 20, backgroundColor: '#f5f5f5', borderRadius: 0.5 }} />
        <Box sx={{ width: 20, height: 20, backgroundColor: '#c8e6c9', borderRadius: 0.5 }} />
        <Box sx={{ width: 20, height: 20, backgroundColor: '#81c784', borderRadius: 0.5 }} />
        <Box sx={{ width: 20, height: 20, backgroundColor: '#4caf50', borderRadius: 0.5 }} />
        <Box sx={{ width: 20, height: 20, backgroundColor: '#2e7d32', borderRadius: 0.5 }} />
        <Typography variant="caption" color="text.secondary">More</Typography>
      </Box>
    </Paper>
  );
}
