import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Import themeStore so its module-level code runs immediately on app load
import './store/themeStore';

import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';

import AdminDashboard from './pages/admin/AdminDashboard';
import BusinessDashboard from './pages/business/BusinessDashboard';
import KnowledgeBase from './pages/business/KnowledgeBase';
import Appointments from './pages/business/Appointments';
import CallLogs from './pages/business/CallLogs';
import Settings from './pages/business/Settings';

const LandingRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard'} replace />;
  }
  return <Landing />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="businesses" element={<div className="p-2"><h1 className="text-2xl font-bold dark:text-white">Businesses</h1></div>} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Business Routes */}
        <Route element={<ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'STAFF']} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<BusinessDashboard />} />
            <Route path="knowledge-base" element={<KnowledgeBase />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="calls" element={<CallLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
