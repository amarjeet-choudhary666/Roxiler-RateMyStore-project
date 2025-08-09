import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAPI, storeAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const CreateStore: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users for store owner selection...');
      // Fetch only STORE_OWNER role users to assign to stores
      const response = await adminAPI.getUsers({ 
        role: 'STORE_OWNER',
        limit: 100
      });
      console.log('Users API response:', response.data);
      
      const storeOwners = response.data.data?.users || response.data?.users || [];
      console.log('Store owners only:', storeOwners);
      
      // Only show STORE_OWNER role users (exclude users who already have stores)
      const eligibleUsers = storeOwners.filter((user: any) => 
        user.role === 'STORE_OWNER' && !user.store
      );
      
      console.log('Eligible store owners without stores:', eligibleUsers);
      setUsers(eligibleUsers);
      
      if (eligibleUsers.length === 0) {
        toast('No available store owners found. Create store owner users first.', {
          icon: 'ℹ️',
        });
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to load users. Please check if you have permission.');
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Creating store with data:', formData);
      await storeAPI.createStore(formData);
      toast.success('Store created successfully!');
      navigate('/admin/stores');
    } catch (error: any) {
      console.error('Store creation error:', error);
      console.error('Error response:', error.response?.data);
      
      // Extract message from HTML error response or JSON
      let message = 'Failed to create store';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string' && error.response.data.includes('already exists')) {
          // Extract message from HTML error page
          const match = error.response.data.match(/Error: (.+?)<br>/);
          message = match ? match[1] : 'Store email already exists';
        } else {
          message = error.response.data.message || error.response.data.error || message;
        }
      }
      
      if (error.response?.status === 409) {
        toast.error(`${message}`, {
          duration: 6000, // Show longer for conflict errors
        });
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/stores')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Store</h1>
          <p className="text-gray-600">Add a new store to the platform</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Store Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter store name"
            />
          </div>

          {/* Store Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Store Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter unique store email"
            />
            <p className="mt-1 text-sm text-gray-500">
              This email must be unique for each store
            </p>
          </div>

          {/* Store Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Store Address *
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={4}
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter store address"
            />
          </div>

          {/* Store Owner */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">
                Store Owner *
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const response = await adminAPI.getDashboard();
                      console.log('Dashboard test:', response.data);
                      toast.success('Admin API is working!');
                    } catch (error) {
                      console.error('Dashboard test failed:', error);
                      toast.error('Admin API test failed');
                    }
                  }}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Test API
                </button>
                <button
                  type="button"
                  onClick={fetchUsers}
                  disabled={loadingUsers}
                  className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  {loadingUsers ? 'Loading...' : 'Refresh Users'}
                </button>
              </div>
            </div>
            {loadingUsers ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading users...</span>
              </div>
            ) : users.length > 0 ? (
              <select
                id="ownerId"
                name="ownerId"
                required
                value={formData.ownerId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a user to be the store owner</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-600 text-center">
                  No store owners available without existing stores.
                  <br />
                  <small className="text-gray-500">
                    (Only store owner role users without stores can be assigned)
                  </small>
                  <br />
                  <Link 
                    to="/admin/users/create" 
                    className="text-blue-600 hover:text-blue-700 ml-1"
                  >
                    Create a store owner user first →
                  </Link>
                </p>
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Select a store owner who doesn't have an existing store
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/stores')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || loadingUsers}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Store...
                </div>
              ) : (
                'Create Store'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          What happens when you create a store?
        </h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• A new store will be added to the platform</li>
          <li>• The selected user will be promoted to Store Owner role</li>
          <li>• The store owner will be able to manage their store</li>
          <li>• Users will be able to find and rate this store</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateStore;