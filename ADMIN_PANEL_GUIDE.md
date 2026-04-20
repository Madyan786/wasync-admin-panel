# WASync Admin Panel - Complete Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Setup & Installation](#setup--installation)
5. [Firebase Configuration](#firebase-configuration)
6. [Project Structure](#project-structure)
7. [Core Components](#core-components)
8. [Device Management](#device-management)
9. [File Management](#file-management)
10. [Analytics Dashboard](#analytics-dashboard)
11. [User Authentication](#user-authentication)
12. [API Integration](#api-integration)
13. [Deployment](#deployment)
14. [Security](#security)

---

## 🎯 Overview

**WASync Admin Panel** is a React-based web application that provides complete control and monitoring over all connected devices and uploaded files.

### Purpose
- Monitor all devices in real-time
- Remote device control (Enable/Disable)
- Manage uploaded files
- View analytics and statistics
- User management and access control

---

## 🚀 Features

### 1. Real-Time Device Monitoring
- ✅ Live device status (Online/Offline)
- ✅ Last seen timestamp
- ✅ Device information (Name, User, OS)
- ✅ Upload statistics per device
- ✅ Storage usage per device

### 2. Remote Device Control
- ✅ Enable/Disable devices remotely
- ✅ Device responds within 30 seconds
- ✅ Forced sync option
- ✅ Device deletion
- ✅ Batch operations

### 3. File Management
- ✅ Browse all uploaded files
- ✅ Filter by device/user/date/type
- ✅ Search functionality
- ✅ Download files
- ✅ Delete files
- ✅ Batch operations
- ✅ File preview

### 4. Analytics & Reports
- ✅ Upload trends (Daily/Weekly/Monthly)
- ✅ Storage growth charts
- ✅ Device activity heatmap
- ✅ File type distribution
- ✅ Export reports (CSV/Excel/PDF)

### 5. User Management
- ✅ Admin authentication
- ✅ Role-based access (Super Admin, Admin, Viewer)
- ✅ User permissions
- ✅ Activity logs
- ✅ Audit trail

### 6. Notifications
- ✅ Real-time alerts
- ✅ Device offline notifications
- ✅ Storage threshold warnings
- ✅ Email notifications (optional)

---

## 💻 Technology Stack

### Frontend
- **Framework:** React 18+
- **Language:** JavaScript/TypeScript
- **UI Library:** Material-UI (MUI)
- **Charts:** Recharts / Chart.js
- **State Management:** React Context / Redux
- **Routing:** React Router v6

### Backend (Firebase)
- **Authentication:** Firebase Auth
- **Database:** Firestore
- **Storage:** Firebase Storage
- **Hosting:** Firebase Hosting
- **Functions:** Cloud Functions (optional)

### Additional Tools
- **Date Handling:** date-fns / moment.js
- **File Size Formatting:** filesize.js
- **Icons:** Material Icons
- **Notifications:** React Toastify
- **Export:** xlsx, jsPDF

---

## 📦 Setup & Installation

### Step 1: Create React Application
```bash
npx create-react-app wasync-admin
cd wasync-admin
```

### Step 2: Install Dependencies
```bash
# Core dependencies
npm install firebase react-router-dom @mui/material @emotion/react @emotion/styled

# UI Components
npm install @mui/icons-material @mui/x-data-grid

# Charts
npm install recharts

# Utilities
npm install date-fns filesize xlsx jspdf

# Notifications
npm install react-toastify
```

### Step 3: Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Select:
# - Hosting
# - Functions (optional)
# - Firestore
# - Storage
```

### Step 4: Environment Variables
Create `.env` file:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_ADMIN_EMAIL=admin@wasync.com
```

### Step 5: Run Development Server
```bash
npm start
```

Application will open at `http://localhost:3000`

---

## 🔥 Firebase Configuration

### Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project or select existing
3. Enable required services:
   - ✅ Authentication
   - ✅ Firestore Database
   - ✅ Storage
   - ✅ Hosting

### Step 2: Firebase Config File

Create `src/firebase.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

### Step 3: Firestore Security Rules

Go to Firebase Console → Firestore → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check admin role
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    // SyncDevices collection
    match /syncDevices/{deviceId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    // DesktopDownloads collection
    match /desktopDownloads/{fileId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    // AdminUsers collection
    match /adminUsers/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
                   get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role == 'super_admin';
    }
    
    // AuditLogs collection
    match /auditLogs/{logId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

### Step 4: Storage Security Rules

Go to Firebase Console → Storage → Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Desktop downloads - read for all authenticated, write for admin
    match /desktopDownloads/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                   get(/databases/$(request.auth.token.firebase.database_id)/documents/adminUsers/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
  }
}
```

---

## 📁 Project Structure

```
wasync-admin/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── MainLayout.jsx
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── StatCard.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   ├── UploadChart.jsx
│   │   │   └── DeviceMap.jsx
│   │   │
│   │   ├── Devices/
│   │   │   ├── DeviceList.jsx
│   │   │   ├── DeviceCard.jsx
│   │   │   ├── DeviceDetail.jsx
│   │   │   └── DeviceStatus.jsx
│   │   │
│   │   ├── Files/
│   │   │   ├── FileList.jsx
│   │   │   ├── FileCard.jsx
│   │   │   ├── FilePreview.jsx
│   │   │   └── FileFilters.jsx
│   │   │
│   │   ├── Analytics/
│   │   │   ├── StorageChart.jsx
│   │   │   ├── FileTypeChart.jsx
│   │   │   ├── ActivityHeatmap.jsx
│   │   │   └── TrendChart.jsx
│   │   │
│   │   ├── Users/
│   │   │   ├── UserList.jsx
│   │   │   ├── UserForm.jsx
│   │   │   └── RoleManager.jsx
│   │   │
│   │   └── Common/
│   │       ├── Loading.jsx
│   │       ├── ErrorBoundary.jsx
│   │       ├── ConfirmDialog.jsx
│   │       └── StatusBadge.jsx
│   │
│   ├── services/
│   │   ├── firebase.js              # Firebase initialization
│   │   ├── authService.js           # Authentication
│   │   ├── deviceService.js         # Device operations
│   │   ├── fileService.js           # File operations
│   │   ├── analyticsService.js      # Analytics data
│   │   └── auditService.js          # Audit logging
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx          # Authentication context
│   │   └── ThemeContext.jsx         # Theme context
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Devices.jsx
│   │   ├── Files.jsx
│   │   ├── Analytics.jsx
│   │   ├── Users.jsx
│   │   └── Settings.jsx
│   │
│   ├── utils/
│   │   ├── formatters.js            # Data formatters
│   │   ├── validators.js            # Input validators
│   │   └── constants.js             # App constants
│   │
│   ├── styles/
│   │   ├── global.css
│   │   └── theme.js
│   │
│   ├── App.js
│   ├── App.test.js
│   ├── index.js
│   └── reportWebVitals.js
│
├── .env
├── package.json
├── README.md
└── firebase.json
```

---

## 🧩 Core Components

### 1. Authentication Context

`src/contexts/AuthContext.jsx`:
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
```

### 2. Main Layout

`src/components/Layout/MainLayout.jsx`:
```javascript
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const DRAWER_WIDTH = 240;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <TopBar onDrawerToggle={handleDrawerToggle} />
      
      <Sidebar 
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
```

### 3. Sidebar Navigation

`src/components/Layout/Sidebar.jsx`:
```javascript
import { List, ListItem, ListItemIcon, ListItemText, Drawer } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Devices as DevicesIcon,
  Folder as FilesIcon,
  Analytics as AnalyticsIcon,
  People as UsersIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Devices', icon: <DevicesIcon />, path: '/devices' },
  { text: 'Files', icon: <FilesIcon />, path: '/files' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Users', icon: <UsersIcon />, path: '/users' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export default function Sidebar({ drawerWidth, mobileOpen, onDrawerToggle }) {
  const location = useLocation();

  const drawer = (
    <div>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={mobileOpen ? onDrawerToggle : undefined}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': { width: drawerWidth }
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth }
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
}
```

---

## 📱 Device Management

### Device Service

`src/services/deviceService.js`:
```javascript
import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

// Get all devices with real-time updates
export function subscribeToDevices(callback) {
  const q = query(collection(db, 'syncDevices'), orderBy('lastSeen', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const devices = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(devices);
  });
}

// Get single device
export async function getDevice(deviceId) {
  const docRef = doc(db, 'syncDevices', deviceId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

// Toggle device enable/disable
export async function toggleDevice(deviceId, isEnabled, adminEmail) {
  const deviceRef = doc(db, 'syncDevices', deviceId);
  
  await updateDoc(deviceRef, {
    isEnabled: isEnabled,
    updatedAt: new Date()
  });
  
  // Log the action
  await logAuditAction({
    action: isEnabled ? 'device_enabled' : 'device_disabled',
    performedBy: adminEmail,
    targetId: deviceId,
    targetType: 'device',
    details: {
      newStatus: isEnabled ? 'enabled' : 'disabled'
    }
  });
}

// Delete device
export async function deleteDevice(deviceId, adminEmail) {
  const deviceRef = doc(db, 'syncDevices', deviceId);
  await deleteDoc(deviceRef);
  
  await logAuditAction({
    action: 'device_deleted',
    performedBy: adminEmail,
    targetId: deviceId,
    targetType: 'device'
  });
}

// Force device sync
export async function forceDeviceSync(deviceId) {
  const deviceRef = doc(db, 'syncDevices', deviceId);
  
  await updateDoc(deviceRef, {
    lastSyncRequest: new Date()
  });
}

// Get device statistics
export async function getDeviceStats(deviceId) {
  const filesQuery = query(
    collection(db, 'desktopDownloads'),
    where('deviceId', '==', deviceId)
  );
  
  const snapshot = await getDocs(filesQuery);
  
  return {
    totalFiles: snapshot.size,
    totalSize: snapshot.docs.reduce((sum, doc) => sum + (doc.data().fileSize || 0), 0)
  };
}
```

### Device List Component

`src/pages/Devices.jsx`:
```javascript
import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Switch,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Sync as SyncIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { subscribeToDevices, toggleDevice, deleteDevice } from '../services/deviceService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeToDevices((devicesData) => {
      setDevices(devicesData);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleDevice = async (deviceId, currentStatus) => {
    try {
      await toggleDevice(deviceId, !currentStatus, currentUser.email);
      toast.success(`Device ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update device: ' + error.message);
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    if (!window.confirm('Are you sure you want to delete this device?')) return;
    
    try {
      await deleteDevice(deviceId, currentUser.email);
      toast.success('Device deleted successfully');
    } catch (error) {
      toast.error('Failed to delete device: ' + error.message);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <h1>Devices</h1>
        <Chip 
          label={`${devices.length} Total Devices`} 
          color="primary" 
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Device Name</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Last Seen</TableCell>
              <TableCell>Files</TableCell>
              <TableCell>Storage</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>{device.deviceName}</TableCell>
                <TableCell>{device.windowsUser}</TableCell>
                <TableCell>
                  <Chip
                    label={device.isOnline ? 'Online' : 'Offline'}
                    color={device.isOnline ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={device.isEnabled ?? true}
                    onChange={() => handleToggleDevice(device.id, device.isEnabled)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>{formatTime(device.lastSeen)}</TableCell>
                <TableCell>{device.totalFilesUploaded || 0}</TableCell>
                <TableCell>{formatBytes(device.totalStorageUsed)}</TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small" color="primary">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Force Sync">
                    <IconButton size="small" color="info">
                      <SyncIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDeleteDevice(device.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
```

---

## 📂 File Management

### File Service

`src/services/fileService.js`:
```javascript
import { db, storage } from './firebase';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';

// Get all files
export async function getAllFiles(filters = {}) {
  let q = collection(db, 'desktopDownloads');
  
  // Apply filters
  const conditions = [];
  
  if (filters.deviceId) {
    conditions.push(where('deviceId', '==', filters.deviceId));
  }
  
  if (filters.fileType) {
    conditions.push(where('fileType', '==', filters.fileType));
  }
  
  if (filters.userId) {
    conditions.push(where('windowsUser', '==', filters.userId));
  }
  
  // Build query
  q = query(q, ...conditions, orderBy('uploadedAt', 'desc'));
  
  if (filters.limit) {
    q = query(q, limit(filters.limit));
  }
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Get download URL
export async function getFileDownloadUrl(storageUrl) {
  try {
    // Extract path from storage URL
    const url = new URL(storageUrl);
    const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
    
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    throw new Error('Failed to get download URL: ' + error.message);
  }
}

// Delete file
export async function deleteFile(fileId, storageUrl, adminEmail) {
  // Delete from Firestore
  const docRef = doc(db, 'desktopDownloads', fileId);
  await deleteDoc(docRef);
  
  // Delete from Storage
  try {
    const url = new URL(storageUrl);
    const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.warn('Failed to delete from storage:', error);
  }
  
  // Log action
  await logAuditAction({
    action: 'file_deleted',
    performedBy: adminEmail,
    targetId: fileId,
    targetType: 'file',
    details: { storageUrl }
  });
}

// Export files to CSV
export function exportFilesToCSV(files) {
  const headers = ['File Name', 'Size', 'Type', 'User', 'Device', 'Uploaded At'];
  const rows = files.map(file => [
    file.fileName,
    file.fileSize,
    file.fileType,
    file.windowsUser,
    file.deviceName,
    file.uploadedAt?.toDate().toLocaleString()
  ]);
  
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `files_export_${new Date().toISOString()}.csv`;
  a.click();
}
```

---

## 📊 Analytics Dashboard

### Analytics Service

`src/services/analyticsService.js`:
```javascript
import { db } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

// Get upload statistics
export async function getUploadStats() {
  const snapshot = await getDocs(collection(db, 'desktopDownloads'));
  
  const stats = {
    totalFiles: snapshot.size,
    totalSize: 0,
    byType: {},
    byDevice: {},
    byDate: {}
  };
  
  snapshot.forEach(doc => {
    const data = doc.data();
    stats.totalSize += data.fileSize || 0;
    
    // Group by type
    const type = data.fileType || 'unknown';
    stats.byType[type] = (stats.byType[type] || 0) + 1;
    
    // Group by device
    const device = data.deviceName || 'unknown';
    stats.byDevice[device] = (stats.byDevice[device] || 0) + 1;
    
    // Group by date
    const date = data.uploadedAt?.toDate().toISOString().split('T')[0];
    if (date) {
      stats.byDate[date] = (stats.byDate[date] || 0) + 1;
    }
  });
  
  return stats;
}

// Get storage usage by device
export async function getStorageByDevice() {
  const snapshot = await getDocs(collection(db, 'syncDevices'));
  
  return snapshot.docs.map(doc => ({
    name: doc.data().deviceName,
    storage: doc.data().totalStorageUsed || 0,
    files: doc.data().totalFilesUploaded || 0
  }));
}

// Get recent activity
export async function getRecentActivity(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const q = query(
    collection(db, 'desktopDownloads'),
    where('uploadedAt', '>=', startDate),
    orderBy('uploadedAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => doc.data());
}
```

### Upload Chart Component

`src/components/Dashboard/UploadChart.jsx`:
```javascript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UploadChart({ data }) {
  const chartData = Object.entries(data.byDate || {})
    .map(([date, count]) => ({
      date,
      uploads: count
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="uploads" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## 🔐 User Authentication

### Login Page

`src/pages/Login.jsx`:
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert 
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in: ' + err.message);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          WASync Admin
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
```

### Protected Route

`src/components/Common/ProtectedRoute.jsx`:
```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}
```

---

## 🔌 API Integration

### Audit Logging Service

`src/services/auditService.js`:
```javascript
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';

// Log an action
export async function logAuditAction({ action, performedBy, targetId, targetType, details }) {
  await addDoc(collection(db, 'auditLogs'), {
    action,
    performedBy,
    targetId,
    targetType,
    details: details || {},
    timestamp: serverTimestamp()
  });
}

// Get recent audit logs
export async function getAuditLogs(limitCount = 50) {
  const q = query(
    collection(db, 'auditLogs'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
```

---

## 🚀 Deployment

### Firebase Hosting

```bash
# Build production version
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Deploy everything
firebase deploy
```

### Environment Variables for Production

Create `.env.production`:
```env
REACT_APP_FIREBASE_API_KEY=prod_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=prod_project.firebaseapp.com
# ... other variables
```

### Custom Domain

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS configuration steps
4. Wait for SSL certificate provisioning

---

## 🔒 Security

### Best Practices

1. **Authentication**
   - ✅ Use Firebase Auth
   - ✅ Implement role-based access
   - ✅ Enable 2FA for admins
   - ✅ Session timeout

2. **Data Protection**
   - ✅ Firestore security rules
   - ✅ Storage security rules
   - ✅ Input validation
   - ✅ XSS protection

3. **API Security**
   - ✅ Validate all inputs
   - ✅ Rate limiting
   - ✅ Audit logging
   - ✅ Error handling

### Security Rules Example

```javascript
// Only allow admin users to modify devices
match /syncDevices/{deviceId} {
  allow read: if request.auth != null;
  allow write: if isAdmin();
}

function isAdmin() {
  return request.auth != null && 
         get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
}
```

---

## 📝 Quick Reference

### Common Operations

```javascript
// Toggle device
await toggleDevice(deviceId, true/false, adminEmail);

// Get all devices
subscribeToDevices((devices) => { /* handle devices */ });

// Delete file
await deleteFile(fileId, storageUrl, adminEmail);

// Get analytics
const stats = await getUploadStats();

// Export to CSV
exportFilesToCSV(files);
```

### UI Components

```javascript
// Status badge
<Chip label="Online" color="success" />
<Chip label="Offline" color="error" />

// Device toggle
<Switch checked={isEnabled} onChange={handleToggle} />

// File size
{formatBytes(fileSize)}

// Date formatting
{formatTime(timestamp)}
```

---

**Admin Panel Documentation Complete!** 🎉

For any questions or support, refer to the main `DOCUMENTATION.md` file.
