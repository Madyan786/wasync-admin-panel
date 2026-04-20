import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button, 
  IconButton,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

export default function FilePreview({ open, onClose, file }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!file) return null;

  const fileExtension = file.fileName?.split('.').pop()?.toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileExtension);
  const isPDF = fileExtension === 'pdf';
  const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);

  const handleDownload = async () => {
    if (!file.storageUrl) {
      toast.error('Download URL not available');
      return;
    }
    
    try {
      // Clean filename - remove timestamp suffix added by Firebase
      let cleanFileName = file.fileName.trim();
      
      // Remove any timestamp pattern like _1234567890123 at the end
      // Pattern: .ext_1234567890123 → .ext
      const timestampPattern = /(_\d{10,13})$/;
      if (timestampPattern.test(cleanFileName)) {
        cleanFileName = cleanFileName.replace(timestampPattern, '');
      }
      
      toast.info(`Preparing ${cleanFileName}...`);
      
      // Create download link with direct URL to avoid CORS issues
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

  const handleClose = () => {
    setLoading(true);
    setError(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: { maxHeight: '90vh' }
        }
      }}
    >
      {/* Custom Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" component="div" noWrap sx={{ mr: 2 }}>
          {file.fileName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleDownload} color="primary" size="small">
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent dividers sx={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress />
            <Typography>Loading preview...</Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography color="error" gutterBottom>
              Preview not available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This file type cannot be previewed
            </Typography>
            <Button onClick={handleDownload} variant="contained" sx={{ mt: 2 }}>
              Download Instead
            </Button>
          </Box>
        )}

        {isImage && (
          <img
            src={file.storageUrl}
            alt={file.fileName}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              objectFit: 'contain'
            }}
          />
        )}

        {isPDF && (
          <iframe
            src={file.storageUrl}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
            style={{
              width: '100%',
              height: '70vh',
              border: 'none'
            }}
            title={file.fileName}
          />
        )}

        {isVideo && (
          <video
            controls
            src={file.storageUrl}
            onLoadedData={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh'
            }}
          >
            Your browser does not support the video tag.
          </video>
        )}

        {!isImage && !isPDF && !isVideo && !loading && !error && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              📄
            </Typography>
            <Typography gutterBottom>
              Preview not available for this file type
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {file.fileType?.toUpperCase() || fileExtension?.toUpperCase()} file
            </Typography>
            <Button onClick={handleDownload} variant="contained" startIcon={<DownloadIcon />}>
              Download File
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleDownload} variant="contained" startIcon={<DownloadIcon />}>
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
}
