import { format, formatDistanceToNow } from 'date-fns';
import { filesize } from 'filesize';

// Format date
export const formatDate = (date, formatStr = 'MMM dd, yyyy HH:mm') => {
  if (!date) return 'N/A';
  try {
    // Handle Firestore Timestamp
    let dateObj;
    if (date.toDate) {
      dateObj = date.toDate();
    } else if (date.seconds) {
      // Handle {seconds, nanoseconds} format
      dateObj = new Date(date.seconds * 1000);
    } else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Date format error:', error);
    return 'Invalid Date';
  }
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  try {
    return formatDistanceToNow(date.toDate(), { addSuffix: true });
  } catch (error) {
    return 'Invalid Date';
  }
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === null || bytes === undefined) return '0 B';
  if (bytes === 0) return '0 B';
  
  // Handle string values
  if (typeof bytes === 'string') {
    const numBytes = parseInt(bytes);
    if (isNaN(numBytes)) return '0 B';
    bytes = numBytes;
  }
  
  try {
    return filesize(bytes);
  } catch (error) {
    console.error('File size format error:', error);
    return '0 B';
  }
};

// Format device status
export const formatDeviceStatus = (lastSeen) => {
  if (!lastSeen) return 'offline';
  
  try {
    const lastSeenDate = lastSeen.toDate();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    return lastSeenDate > fiveMinutesAgo ? 'online' : 'offline';
  } catch (error) {
    return 'offline';
  }
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get file icon based on file type
export const getFileIcon = (fileName) => {
  if (!fileName) return '📄';
  
  const extension = fileName.split('.').pop().toLowerCase();
  
  const iconMap = {
    pdf: '📕',
    doc: '📘',
    docx: '📘',
    xls: '📗',
    xlsx: '📗',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    mp4: '🎥',
    mp3: '🎵',
    zip: '📦',
    rar: '📦',
  };
  
  return iconMap[extension] || '📄';
};

// Get file type category
export const getFileType = (fileName) => {
  if (!fileName) return 'unknown';
  
  const extension = fileName.split('.').pop().toLowerCase();
  
  const typeMap = {
    pdf: 'PDF',
    doc: 'Document',
    docx: 'Document',
    xls: 'Spreadsheet',
    xlsx: 'Spreadsheet',
    jpg: 'Image',
    jpeg: 'Image',
    png: 'Image',
    gif: 'Image',
    mp4: 'Video',
    mp3: 'Audio',
    zip: 'Archive',
    rar: 'Archive',
  };
  
  return typeMap[extension] || 'Other';
};
