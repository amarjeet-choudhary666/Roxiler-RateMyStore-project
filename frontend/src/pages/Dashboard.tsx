import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import StoreOwnerDashboard from './store-owner/StoreOwnerDashboard';
import UserDashboard from './UserDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'SYSTEM_ADMIN':
      return <AdminDashboard />;
    case 'STORE_OWNER':
      return <StoreOwnerDashboard />;
    case 'NORMAL_USER':
      return <UserDashboard />;
    default:
      return <UserDashboard />;
  }
};

export default Dashboard;