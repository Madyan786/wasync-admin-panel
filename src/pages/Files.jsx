import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress, TextField, InputAdornment, Chip } from '@mui/material';
import { Delete as DeleteIcon, Download as DownloadIcon, Search as SearchIcon, Visibility as PreviewIcon } from '@mui/icons-material';
import { getAllFiles, deleteFile } from '../services/fileService';
import { formatDate, formatFileSize, getFileIcon, getFileType } from '../utils/formatters';
import { toast } from 'react-toastify';
import FilePreview from '../components/Common/FilePreview';

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, fileId: null, filePath: null });
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const filesData = await getAllFiles();
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
      // Use storageUrl directly
      if (!file.storageUrl) {
        toast.error('Download URL not available');
        return;
      }
      
      // Clean filename - remove timestamp suffix added by Firebase
      let cleanFileName = file.fileName.trim();
      
      // Remove any timestamp pattern like _1234567890123 at the end
      // Pattern: .ext_1234567890123 → .ext
      const timestampPattern = /(_\d{10,13})$/;
      if (timestampPattern.test(cleanFileName)) {
        cleanFileName = cleanFileName.replace(timestampPattern, '');
      }
      
      toast.info(`Preparing ${cleanFileName}...`);
      
      // Create a temporary link and trigger download
      // Using direct URL to avoid CORS issues with blob method
      const link = document.createElement('a');
      link.href = file.storageUrl;
      link.download = cleanFileName; // EXACT filename - no timestamp
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
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

  const filteredFiles = files.filter(file => 
    (file.fileName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (file.deviceName || '').toLowerCase().includes(searchTerm.toLowerCase())
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
        File Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search files by name or device..."
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFiles.map((file) => (
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
                      {file.fileName || 'Unknown'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{getFileType(file.fileName)}</TableCell>
                <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                <TableCell>{file.deviceName || 'N/A'}</TableCell>
                <TableCell>{formatDate(file.uploadedAt, 'MMM dd, yyyy HH:mm')}</TableCell>
                <TableCell>
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

      {filteredFiles.length === 0 && !loading && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No files found
        </Typography>
      )}

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
