import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

// Get all devices
export const getAllDevices = async () => {
  try {
    const devicesRef = collection(db, 'syncDevices');
    const q = query(devicesRef, orderBy('lastSeen', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const devices = [];
    querySnapshot.forEach((doc) => {
      devices.push({ id: doc.id, ...doc.data() });
    });
    
    return devices;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};

// Subscribe to real-time device updates
export const subscribeToDevices = (callback) => {
  try {
    const devicesRef = collection(db, 'syncDevices');
    const q = query(devicesRef, orderBy('lastSeen', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const devices = [];
      snapshot.forEach((doc) => {
        devices.push({ id: doc.id, ...doc.data() });
      });
      callback(devices);
    }, (error) => {
      console.error('Error subscribing to devices:', error);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up device subscription:', error);
    throw error;
  }
};

// Get single device
export const getDevice = async (deviceId) => {
  try {
    const deviceRef = doc(db, 'syncDevices', deviceId);
    const deviceSnap = await getDoc(deviceRef);
    
    if (deviceSnap.exists()) {
      return { id: deviceSnap.id, ...deviceSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching device:', error);
    throw error;
  }
};

// Enable/Disable device
export const toggleDeviceStatus = async (deviceId, enabled) => {
  try {
    const deviceRef = doc(db, 'syncDevices', deviceId);
    await updateDoc(deviceRef, {
      enabled: enabled,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error toggling device status:', error);
    throw error;
  }
};

// Delete device
export const deleteDevice = async (deviceId) => {
  try {
    const deviceRef = doc(db, 'syncDevices', deviceId);
    await deleteDoc(deviceRef);
    return true;
  } catch (error) {
    console.error('Error deleting device:', error);
    throw error;
  }
};

// Force sync device
export const forceSyncDevice = async (deviceId) => {
  try {
    const deviceRef = doc(db, 'syncDevices', deviceId);
    await updateDoc(deviceRef, {
      syncRequested: true,
      syncRequestedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error forcing sync:', error);
    throw error;
  }
};

// Get devices by user
export const getDevicesByUser = async (userId) => {
  try {
    const devicesRef = collection(db, 'syncDevices');
    const q = query(devicesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const devices = [];
    querySnapshot.forEach((doc) => {
      devices.push({ id: doc.id, ...doc.data() });
    });
    
    return devices;
  } catch (error) {
    console.error('Error fetching user devices:', error);
    throw error;
  }
};

// Batch enable/disable devices
export const batchToggleDevices = async (deviceIds, enabled) => {
  try {
    const promises = deviceIds.map(async (deviceId) => {
      const deviceRef = doc(db, 'syncDevices', deviceId);
      return updateDoc(deviceRef, {
        enabled: enabled,
        updatedAt: serverTimestamp()
      });
    });
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error batch toggling devices:', error);
    throw error;
  }
};

// Batch delete devices
export const batchDeleteDevices = async (deviceIds) => {
  try {
    const promises = deviceIds.map(async (deviceId) => {
      const deviceRef = doc(db, 'syncDevices', deviceId);
      return deleteDoc(deviceRef);
    });
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error batch deleting devices:', error);
    throw error;
  }
};
