import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

// Get all files
export const getAllFiles = async () => {
  try {
    const filesRef = collection(db, 'desktopDownloads');
    const q = query(filesRef, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const files = [];
    querySnapshot.forEach((doc) => {
      files.push({ id: doc.id, ...doc.data() });
    });
    
    return files;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

// Get single file
export const getFile = async (fileId) => {
  try {
    const fileRef = doc(db, 'desktopDownloads', fileId);
    const fileSnap = await getDoc(fileRef);
    
    if (fileSnap.exists()) {
      return { id: fileSnap.id, ...fileSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
};

// Get files by device
export const getFilesByDevice = async (deviceId) => {
  try {
    const filesRef = collection(db, 'desktopDownloads');
    const q = query(filesRef, where('deviceId', '==', deviceId));
    const querySnapshot = await getDocs(q);
    
    const files = [];
    querySnapshot.forEach((doc) => {
      files.push({ id: doc.id, ...doc.data() });
    });
    
    return files;
  } catch (error) {
    console.error('Error fetching device files:', error);
    throw error;
  }
};

// Get download URL for file
export const getFileDownloadUrl = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
};

// Delete file
export const deleteFile = async (fileId, filePath) => {
  try {
    // Delete from Firestore
    const fileRef = doc(db, 'desktopDownloads', fileId);
    await deleteDoc(fileRef);
    
    // Delete from Storage
    if (filePath) {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Get recent files
export const getRecentFiles = async (limitCount = 10) => {
  try {
    const filesRef = collection(db, 'desktopDownloads');
    const q = query(filesRef, orderBy('uploadedAt', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    const files = [];
    querySnapshot.forEach((doc) => {
      files.push({ id: doc.id, ...doc.data() });
    });
    
    return files;
  } catch (error) {
    console.error('Error fetching recent files:', error);
    throw error;
  }
};

// Batch delete files
export const batchDeleteFiles = async (fileIds) => {
  try {
    const promises = fileIds.map(async ({ fileId, filePath }) => {
      // Delete from Firestore
      const fileRef = doc(db, 'desktopDownloads', fileId);
      await deleteDoc(fileRef);
      
      // Delete from Storage if path exists
      if (filePath) {
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
      }
    });
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error batch deleting files:', error);
    throw error;
  }
};
