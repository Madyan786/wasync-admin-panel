import { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box, Divider, CircularProgress } from '@mui/material';
import { getRecentFiles } from '../../services/fileService';
import { formatDate, getFileIcon, truncateText } from '../../utils/formatters';

export default function RecentActivity() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentFiles();
  }, []);

  const fetchRecentFiles = async () => {
    try {
      const recentFiles = await getRecentFiles(10);
      setFiles(recentFiles);
    } catch (error) {
      console.error('Error fetching recent files:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Recent Activity
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {files.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No recent activity
        </Typography>
      ) : (
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {files.map((file, index) => (
            <Box key={file.id}>
              <ListItem alignItems="flex-start">
                <Box sx={{ mr: 2, fontSize: 24 }}>
                  {getFileIcon(file.fileName)}
                </Box>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="medium">
                      {truncateText(file.fileName || 'Unknown File', 30)}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {formatDate(file.uploadedAt, 'MMM dd, yyyy HH:mm')}
                      </Typography>
                      {file.deviceName && (
                        <Typography variant="caption" color="text.secondary">
                          From: {file.deviceName}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
              {index < files.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Paper>
  );
}
