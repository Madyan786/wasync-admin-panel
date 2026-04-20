import { 
  collection, 
  addDoc, 
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Log audit event
export const logAuditEvent = async (event) => {
  try {
    const auditRef = collection(db, 'auditLogs');
    await addDoc(auditRef, {
      ...event,
      timestamp: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error logging audit event:', error);
    throw error;
  }
};

// Get audit logs
export const getAuditLogs = async (limitCount = 50) => {
  try {
    const logsRef = collection(db, 'auditLogs');
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    
    return logs;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

// Get audit logs by user
export const getAuditLogsByUser = async (userId, limitCount = 50) => {
  try {
    const logsRef = collection(db, 'auditLogs');
    const q = query(
      logsRef, 
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    
    return logs;
  } catch (error) {
    console.error('Error fetching user audit logs:', error);
    throw error;
  }
};
