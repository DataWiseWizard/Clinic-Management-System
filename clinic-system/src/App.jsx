import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { NotificationProvider } from "./features/notifications/NotificationContext";
import NetworkStatus from "./components/ui/NetworkStatus";
import LoginPage from './pages/LoginPage';
import LiveQueuePage from './pages/LiveQueuePage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ReceptionDashboard from './pages/reception/ReceptionDashboard';
import ReceptionRegistration from './pages/reception/ReceptionRegistration';
import ReceptionBilling from './pages/reception/ReceptionBilling';
import AnalyticsDashboard from './features/stats/AnalyticsDashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import CheckIn from './pages/CheckIn';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <NetworkStatus />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/live-queue" element={<LiveQueuePage />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route
              path="/doctor/dashboard"
              element={
                <RoleRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/doctor/analytics"
              element={
                <RoleRoute allowedRoles={['doctor']}>
                  <DashboardLayout role="doctor">
                    <div className="mb-6">
                      <h1 className="text-2xl font-bold text-gray-800">Clinic Analytics</h1>
                    </div>
                    <AnalyticsDashboard />
                  </DashboardLayout>
                </RoleRoute>
              }
            />
            <Route
              path="/reception/dashboard"
              element={
                <RoleRoute allowedRoles={['receptionist']}>
                  <ReceptionDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/reception/register"
              element={
                <RoleRoute allowedRoles={['receptionist']}>
                  <ReceptionRegistration />
                </RoleRoute>
              }
            />
            <Route
              path="/reception/billing"
              element={
                <RoleRoute allowedRoles={['receptionist']}>
                  <ReceptionBilling />
                </RoleRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App
