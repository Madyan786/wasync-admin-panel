// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (minimum 6 characters)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validate required field
export const isRequired = (value) => {
  return value && value.trim().length > 0;
};

// Validate file size (max 100MB)
export const isValidFileSize = (size, maxSizeMB = 100) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
};

// Validate file type
export const isValidFileType = (fileName, allowedTypes = []) => {
  if (!fileName || allowedTypes.length === 0) return true;
  
  const extension = fileName.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
};
