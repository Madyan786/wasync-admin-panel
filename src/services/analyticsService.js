import { 
  collection, 
  getDocs, 
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Get upload statistics
export const getUploadStats = async (days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const filesRef = collection(db, 'desktopDownloads');
    const q = query(
      filesRef, 
      where('uploadedAt', '>=', Timestamp.fromDate(startDate)),
      orderBy('uploadedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    let totalUploads = 0;
    let totalSize = 0;
    const uploadsByDate = {};
    const uploadsByType = {};
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalUploads++;
      totalSize += data.size || 0;
      
      // Group by date
      const date = data.uploadedAt?.toDate().toLocaleDateString();
      uploadsByDate[date] = (uploadsByDate[date] || 0) + 1;
      
      // Group by file type
      const fileType = data.fileType || 'unknown';
      uploadsByType[fileType] = (uploadsByType[fileType] || 0) + 1;
    });
    
    return {
      totalUploads,
      totalSize,
      uploadsByDate,
      uploadsByType
    };
  } catch (error) {
    console.error('Error fetching upload stats:', error);
    throw error;
  }
};

// Get device activity
export const getDeviceActivity = async () => {
  try {
    const devicesRef = collection(db, 'syncDevices');
    const querySnapshot = await getDocs(devicesRef);
    
    const activity = {
      totalDevices: 0,
      onlineDevices: 0,
      offlineDevices: 0,
      devicesByOS: {}
    };
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      activity.totalDevices++;
      
      // Check if online (last seen within 5 minutes)
      const lastSeen = data.lastSeen?.toDate();
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      if (lastSeen > fiveMinutesAgo) {
        activity.onlineDevices++;
      } else {
        activity.offlineDevices++;
      }
      
      // Group by OS
      const os = data.os || 'unknown';
      activity.devicesByOS[os] = (activity.devicesByOS[os] || 0) + 1;
    });
    
    return activity;
  } catch (error) {
    console.error('Error fetching device activity:', error);
    throw error;
  }
};

// Get storage growth data
export const getStorageGrowth = async (days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const filesRef = collection(db, 'desktopDownloads');
    const q = query(
      filesRef, 
      where('uploadedAt', '>=', Timestamp.fromDate(startDate)),
      orderBy('uploadedAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const growthData = [];
    let cumulativeSize = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      cumulativeSize += data.size || 0;
      
      growthData.push({
        date: data.uploadedAt?.toDate().toLocaleDateString(),
        size: cumulativeSize
      });
    });
    
    return growthData;
  } catch (error) {
    console.error('Error fetching storage growth:', error);
    throw error;
  }
};

// Get analytics summary
export const getAnalyticsSummary = async () => {
  try {
    const [uploadStats, deviceActivity] = await Promise.all([
      getUploadStats(7),
      getDeviceActivity()
    ]);
    
    return {
      uploads: uploadStats,
      devices: deviceActivity
    };
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    throw error;
  }
};
