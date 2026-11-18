import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorListingPage from './pages/DoctorListingPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Authenticated Pages
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AppointmentsPage from './pages/AppointmentsPage';
import HealthRecordsPage from './pages/HealthRecordsPage';
import MedicineRemindersPage from './pages/MedicineRemindersPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public and General Routes with Main Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/doctors" element={<DoctorListingPage />} />
              <Route path="/doctors/:id" element={<DoctorDetailPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:slug" element={<ArticleDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Dashboard & Workspace Routes with Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/patient-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['patient', 'admin']}>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/records" element={<HealthRecordsPage />} />
              <Route path="/reminders" element={<MedicineRemindersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
