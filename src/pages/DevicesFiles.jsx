import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Alert, 
  CircularProgress, 
  TextField, 
  InputAdornment,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Download as DownloadIcon, 
  Search as SearchIcon, 
  Visibility as PreviewIcon,
  DesktopWindows as DesktopIcon,
  Folder as FolderIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { getAllFiles, subscribeToDevices, deleteFile } from '../services/fileService';
import { formatDate, formatFileSize, getFileIcon, getFileType } from '../utils/formatters';
import { toast } from 'react-toastify';
import FilePreview from '../components/Common/FilePreview';

export default function DevicesFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, fileId: null, filePath: null });
  const [previewFile, setPreviewFile] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  useEffect(() => {
    fetchFiles();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchFiles, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const filesData = await getAllFiles();
      
      // Debug: Log data structure
      console.log('=== DEVICES FILES DEBUG ===');
      console.log('Total files loaded:', filesData.length);
      if (filesData.length > 0) {
        console.log('First file:', filesData[0]);
        console.log('Available fields:', Object.keys(filesData[0]));
        console.log('Devices found:', [...new Set(filesData.map(f => f.deviceName))]);
      }
      console.log('===========================');
      
      setFiles(filesData);
    } catch (err) {
      console.error('Fetch files error:', err);
      setError('Failed to load files');
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file) => {
    try {
      if (!file.storageUrl) {
        toast.error('Download URL not available');
        return;
      }
      
      let cleanFileName = file.fileName.trim();
      const timestampPattern = /(_\d{10,13})$/;
      if (timestampPattern.test(cleanFileName)) {
        cleanFileName = cleanFileName.replace(timestampPattern, '');
      }
      
      toast.info(`Preparing ${cleanFileName}...`);
      
      const link = document.createElement('a');
      link.href = file.storageUrl;
      link.download = cleanFileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      
      toast.success(`✅ ${cleanFileName} downloaded!`);
    } catch (err) {
      console.error('Download error:', err);
      toast.error(`❌ Failed to download: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFile(deleteDialog.fileId, deleteDialog.filePath);
      toast.success('File deleted successfully');
      setDeleteDialog({ open: false, fileId: null, filePath: null });
      fetchFiles();
    } catch (err) {
      toast.error('Failed to delete file');
    }
  };

  // Group files by device
  const devicesMap = files.reduce((acc, file) => {
    const deviceName = file.deviceName || 'Unknown Device';
    const windowsUser = file.windowsUser || 'Unknown User';
    const key = `${deviceName} - ${windowsUser}`;
    
    if (!acc[key]) {
      acc[key] = {
        deviceName,
        windowsUser,
        files: [],
        totalSize: 0
      };
    }
    
    acc[key].files.push(file);
    acc[key].totalSize += file.fileSize || 0;
    
    return acc;
  }, {});

  const devices = Object.values(devicesMap);

  const filteredDevices = selectedDevice === 'all' 
    ? devices 
    : devices.filter(d => `${d.deviceName} - ${d.windowsUser}` === selectedDevice);

  const filteredFiles = searchTerm 
    ? files.filter(file => 
        (file.fileName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.deviceName || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : files;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        📱 Devices & Files
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        View files organized by desktop device and user
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DesktopIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{devices.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Devices</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FolderIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{files.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Files</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <GroupIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{formatFileSize(devices.reduce((sum, d) => sum + d.totalSize, 0))}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Storage</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Device Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filter by Device:
        </Typography>
        <Tabs 
          value={selectedDevice} 
          onChange={(e, newValue) => setSelectedDevice(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Devices" value="all" />
          {devices.map((device) => (
            <Tab 
              key={`${device.deviceName}-${device.windowsUser}`}
              label={`${device.deviceName} (${device.windowsUser})`}
              value={`${device.deviceName} - ${device.windowsUser}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search files by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Device Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {filteredDevices.map((device, index) => (
          <Box key={index}>
            <Card elevation={3}>
              <CardContent>
                {/* Device Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DesktopIcon color="primary" />
                      {device.deviceName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      👤 Windows User: <strong>{device.windowsUser}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📁 Folder: <code>desktopDownloads/{device.windowsUser}/</code>
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={`${device.files.length} files`} 
                      color="primary" 
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={formatFileSize(device.totalSize)} 
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Files Table */}
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>File Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Original Path</TableCell>
                        <TableCell>Uploaded</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {device.files.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span style={{ fontSize: 20 }}>{getFileIcon(file.fileName)}</span>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  cursor: 'pointer',
                                  '&:hover': { textDecoration: 'underline', color: 'primary.main' }
                                }}
                                onClick={() => setPreviewFile(file)}
                              >
                                {file.fileName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{getFileType(file.fileName)}</TableCell>
                          <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                          <TableCell>
                            <Tooltip title={file.filePath}>
                              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                {file.filePath.split('\\').pop()}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>{formatDate(file.uploadedAt, 'MMM dd, yyyy HH:mm')}</TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => setPreviewFile(file)} color="info" title="Preview">
                              <PreviewIcon />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDownload(file)} color="primary" title="Download">
                              <DownloadIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => setDeleteDialog({ open: true, fileId: file.id, filePath: file.filePath })} 
                              color="error"
                              title="Delete"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {filteredDevices.length === 0 && !loading && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No devices found
        </Typography>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, fileId: null, filePath: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this file? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, fileId: null, filePath: null })}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Preview Modal */}
      <FilePreview 
        open={!!previewFile} 
        onClose={() => setPreviewFile(null)} 
        file={previewFile}
      />
    </Box>
  );
}
