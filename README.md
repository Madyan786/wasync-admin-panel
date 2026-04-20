# WASync Admin Panel

A comprehensive React-based admin panel for monitoring and managing WASync devices and files.

## 🚀 Features

### Core Features
- **Real-Time Device Monitoring**: Track all connected devices with live status
- **Remote Device Control**: Enable/disable devices remotely
- **File Management**: Browse, search, download, and delete uploaded files
- **Analytics Dashboard**: View upload trends, storage usage, and device activity
- **User Management**: Manage admin users and roles
- **Responsive Design**: Works on desktop and mobile devices

### Advanced Features ✨ NEW
- **Batch Operations**: Select and perform actions on multiple devices/files simultaneously
- **File Preview**: Preview images, PDFs, and videos directly in the browser
- **Export Reports**: Export data to CSV, Excel, or PDF formats
- **Activity Heatmap**: Visual heatmap showing device activity patterns
- **Audit Logs**: Complete audit trail of all admin actions
- **Role-Based Access Control**: Granular permissions based on user roles (Super Admin, Admin, Viewer)
- **Device Status Overview**: Visual overview of all devices with online/offline status

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## 🔧 Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd wasync-admin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase configuration

4. **Set up environment variables**:
   Create a `.env` file in the root directory with your Firebase config:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_ADMIN_EMAIL=admin@wasync.com
   ```

5. **Start the development server**:
   ```bash
   npm start
   ```

   The application will open at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
wasync-admin/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── MainLayout.jsx
│   │   └── Dashboard/
│   │       ├── StatCard.jsx
│   │       ├── UploadChart.jsx
│   │       └── RecentActivity.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Devices.jsx
│   │   ├── Files.jsx
│   │   ├── Analytics.jsx
│   │   ├── Users.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   ├── firebase.js
│   │   ├── authService.js
│   │   ├── deviceService.js
│   │   ├── fileService.js
│   │   ├── analyticsService.js
│   │   └── auditService.js
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .env
└── package.json
```

## 🔥 Firebase Setup

### 1. Firestore Security Rules

Go to Firebase Console → Firestore → Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    match /syncDevices/{deviceId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    match /desktopDownloads/{fileId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    match /adminUsers/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
                   get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role == 'super_admin';
    }
    
    match /auditLogs/{logId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

### 2. Storage Security Rules

Go to Firebase Console → Storage → Rules and add:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /desktopDownloads/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## 🛠️ Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## 📊 Firestore Collections

The application expects the following Firestore collections:

### syncDevices
```javascript
{
  name: string,
  userId: string,
  userName: string,
  os: string,
  enabled: boolean,
  lastSeen: Timestamp,
  uploadCount: number,
  createdAt: Timestamp
}
```

### desktopDownloads
```javascript
{
  fileName: string,
  deviceId: string,
  deviceName: string,
  size: number,
  fileType: string,
  storagePath: string,
  uploadedAt: Timestamp
}
```

### adminUsers
```javascript
{
  email: string,
  role: 'super_admin' | 'admin' | 'viewer',
  enabled: boolean
}
```

## 🎨 Technology Stack

- **Frontend**: React 18
- **UI Framework**: Material-UI (MUI)
- **Routing**: React Router v6
- **Charts**: Recharts
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Notifications**: React Toastify
- **Date Handling**: date-fns
- **File Formatting**: filesize

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `build/` folder.

### Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

## 🔐 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use Firebase Security Rules** to protect your data
3. **Enable Firebase App Check** for additional security
4. **Use strong passwords** for admin accounts
5. **Regularly update dependencies** to patch security vulnerabilities

## 📝 License

This project is private and proprietary.

## 👥 Support

For support or questions, please contact the development team.

---

**Built with ❤️ using React and Firebase**
