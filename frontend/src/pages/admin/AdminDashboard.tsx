import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import CreateStoreWidget from '../../components/admin/CreateStoreWidget';
import {
  UserGroupIcon,
  BuildingStorefrontIcon,
  StarIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
  roleDistribution: {
    SYSTEM_ADMIN: number;
    NORMAL_USER: number;
    STORE_OWNER: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboard();
      const data = response.data.data;
      setStats({
        totalUsers: data.statistics.totalUsers,
        totalStores: data.statistics.totalStores,
        totalRatings: data.statistics.totalRatings,
        roleDistribution: data.statistics.usersByRole
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-purple-100 text-lg">
          Monitor and manage your platform's performance and users.
        </p>
      </div>

      {/* Quick Create Store Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">🏪 Create New Store</h2>
            <p className="text-green-100">Add a new store to the platform and assign an owner</p>
          </div>
          <Link
            to="/admin/stores/create"
            className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold shadow-lg"
          >
            Create Store
          </Link>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BuildingStorefrontIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Stores</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalStores || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <StarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Ratings</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalRatings || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalRatings && stats?.totalStores 
                  ? (stats.totalRatings / stats.totalStores).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">User Role Distribution</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">System Admins</span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {stats?.roleDistribution?.SYSTEM_ADMIN || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Store Owners</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {stats?.roleDistribution?.STORE_OWNER || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Normal Users</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {stats?.roleDistribution?.NORMAL_USER || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Store Management Widget */}
        <CreateStoreWidget />

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/admin/users"
              className="block w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center">
                <UserGroupIcon className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Manage Users</h3>
                  <p className="text-sm text-gray-600">Add, edit, or remove users</p>
                </div>
              </div>
            </Link>

            <div className="block w-full p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
              <div className="flex items-center justify-between">
                <Link 
                  to="/admin/stores"
                  className="flex items-center flex-1 hover:text-green-700"
                >
                  <BuildingStorefrontIcon className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Manage Stores</h3>
                    <p className="text-sm text-gray-600">Add, edit, or remove stores</p>
                  </div>
                </Link>
                <Link
                  to="/admin/stores/create"
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors ml-4"
                >
                  Create
                </Link>
              </div>
            </div>

            <button
              onClick={fetchDashboardStats}
              className="block w-full p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center">
                <ChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Refresh Data</h3>
                  <p className="text-sm text-gray-600">Update dashboard statistics</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Platform Health */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats?.totalUsers && stats?.totalStores 
                ? (stats.totalUsers / stats.totalStores).toFixed(1)
                : '0.0'
              }
            </div>
            <p className="text-sm text-gray-600">Users per Store</p>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats?.totalRatings && stats?.totalUsers 
                ? (stats.totalRatings / stats.totalUsers).toFixed(1)
                : '0.0'
              }
            </div>
            <p className="text-sm text-gray-600">Ratings per User</p>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats?.totalStores && stats?.roleDistribution?.STORE_OWNER
                ? Math.round((stats.totalStores / stats.roleDistribution.STORE_OWNER) * 100)
                : 0
              }%
            </div>
            <p className="text-sm text-gray-600">Store Owner Utilization</p>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Quick Store Creation */}
      <Link
        to="/admin/stores/create"
        className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50"
        title="Create New Store"
      >
        <PlusIcon className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default AdminDashboard;