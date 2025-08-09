import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext'; 
import { useAuth } from './contexts/AuthContext'; 

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RoleSelection from './pages/auth/RoleSelection';
import AdminRegister from './pages/auth/AdminRegister';
import StoreOwnerRegister from './pages/auth/StoreOwnerRegister';
import Dashboard from './pages/Dashboard';
import Stores from './pages/Stores';
import MyRatings from './pages/MyRatings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageStores from './pages/admin/ManageStores';
import CreateStore from './pages/admin/CreateStore';
import CreateUser from './pages/admin/CreateUser';
import StoreOwnerDashboard from './pages/store-owner/StoreOwnerDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ 
  children, 
  roles 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppLayout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register-type" element={<RoleSelection />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/admin" element={<AdminRegister />} />
              <Route path="/register/store-owner" element={<StoreOwnerRegister />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/stores" element={
                <ProtectedRoute roles={['NORMAL_USER']}>
                  <Stores />
                </ProtectedRoute>
              } />
              
              <Route path="/my-ratings" element={
                <ProtectedRoute roles={['NORMAL_USER']}>
                  <MyRatings />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={['SYSTEM_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/users" element={
                <ProtectedRoute roles={['SYSTEM_ADMIN']}>
                  <ManageUsers />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/stores" element={
                <ProtectedRoute roles={['SYSTEM_ADMIN']}>
                  <ManageStores />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/stores/create" element={
                <ProtectedRoute roles={['SYSTEM_ADMIN']}>
                  <CreateStore />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/users/create" element={
                <ProtectedRoute roles={['SYSTEM_ADMIN']}>
                  <CreateUser />
                </ProtectedRoute>
              } />
              
              <Route path="/store-owner/dashboard" element={
                <ProtectedRoute roles={['STORE_OWNER']}>
                  <StoreOwnerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppLayout>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
