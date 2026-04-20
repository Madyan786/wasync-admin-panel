import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Alert, CircularProgress, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { getAuditLogs } from '../services/auditService';
import { formatDate } from '../utils/formatters';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const logsData = await getAuditLogs(100);
      setLogs(logsData);
    } catch (err) {
      setError('Failed to load audit logs');
      console.error('Audit logs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (event) => {
    const colorMap = {
      device_enable: 'success',
      device_disable: 'warning',
      device_delete: 'error',
      file_delete: 'error',
      file_download: 'info',
      user_login: 'primary',
      user_logout: 'default',
      settings_update: 'secondary'
    };
    return colorMap[event] || 'default';
  };

  const filteredLogs = logs.filter(log =>
    (log.event || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        Audit Logs
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search logs by event, user, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{formatDate(log.timestamp, 'MMM dd, yyyy HH:mm:ss')}</TableCell>
                <TableCell>
                  <Chip 
                    label={log.event?.replace(/_/g, ' ')} 
                    color={getEventColor(log.event)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{log.userName || log.userEmail || 'System'}</TableCell>
                <TableCell>{log.description || '-'}</TableCell>
                <TableCell>{log.ipAddress || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredLogs.length === 0 && !loading && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No audit logs found
        </Typography>
      )}
    </Box>
  );
}
