import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import Files from './pages/Files';
import DevicesFiles from './pages/DevicesFiles';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import Settings from './pages/Settings';
import AuditLogs from './pages/AuditLogs';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Public Route Component (redirect to dashboard if logged in)
function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="devices" element={<Devices />} />
        <Route path="files" element={<Files />} />
        <Route path="devices-files" element={<DevicesFiles />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="users" element={<Users />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
