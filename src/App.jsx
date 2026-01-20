import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerHome from './pages/customer/Home';
import ServiceDetail from './pages/customer/ServiceDetail';
import BookingSuccess from './pages/customer/BookingSuccess';
import BookingDetail from './pages/customer/BookingDetail';
import ProviderDashboard from './pages/provider/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Customer routes */}
          <Route
            path="/customer/home"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/service/:id"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <ServiceDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/booking-success"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <BookingSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/booking/:id"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <BookingDetail />
              </ProtectedRoute>
            }
          />

          {/* Provider routes */}
          <Route
            path="/provider/dashboard"
            element={
              <ProtectedRoute allowedRoles={['PROVIDER']}>
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
