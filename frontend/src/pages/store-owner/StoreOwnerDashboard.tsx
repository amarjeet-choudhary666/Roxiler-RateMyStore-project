import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storeAPI } from '../../services/api';
import {
  BuildingStorefrontIcon,
  StarIcon,
  UsersIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface StoreData {
  store: {
    id: string;
    name: string;
    email: string;
    address: string;
    createdAt: string;
  };
  statistics: {
    averageRating: number;
    totalRatings: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  recentRatings: Array<{
    id: string;
    rating: number;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

const StoreOwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasStore, setHasStore] = useState(false);

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const response = await storeAPI.getOwnerDashboard();
      setStoreData(response.data.data);
      setHasStore(true);
    } catch (error: any) {
      console.error('Error fetching store data:', error);
      if (error.response?.status === 404) {
        setHasStore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarSolidIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!hasStore) {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.name}! 🏪
          </h1>
          <p className="text-green-100 text-lg">
            You don't have a store yet. Contact an administrator to create one for you.
          </p>
        </div>

        {/* No Store Message */}
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <BuildingStorefrontIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Store Found
          </h2>
          <p className="text-gray-600 mb-6">
            You need to have a store assigned to you by an administrator before you can access the store owner dashboard.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What to do next:</h3>
            <ul className="text-blue-800 text-sm space-y-1 text-left">
              <li>• Contact your system administrator</li>
              <li>• Request them to create a store and assign you as the owner</li>
              <li>• Once assigned, you'll be able to manage your store from this dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 🏪
        </h1>
        <p className="text-green-100 text-lg">
          Manage your store "{storeData?.store.name}" and track customer feedback.
        </p>
      </div>

      {/* Store Info Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900">{storeData?.store.name}</h3>
            <p className="text-gray-600">{storeData?.store.email}</p>
            <p className="text-gray-600 mt-2">{storeData?.store.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Store created on</p>
            <p className="font-medium text-gray-900">
              {storeData?.store.createdAt ? new Date(storeData.store.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {storeData?.statistics.averageRating.toFixed(1) || '0.0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Ratings</p>
              <p className="text-2xl font-bold text-gray-900">
                {storeData?.statistics.totalRatings || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Customer Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {storeData?.recentRatings.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      {storeData?.statistics.ratingDistribution && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Rating Distribution</h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = storeData.statistics.ratingDistribution[rating as keyof typeof storeData.statistics.ratingDistribution];
              const percentage = storeData.statistics.totalRatings > 0 
                ? (count / storeData.statistics.totalRatings) * 100 
                : 0;
              
              return (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center w-20">
                    <span className="text-sm font-medium text-gray-900 mr-2">{rating}</span>
                    <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm text-gray-600">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Ratings */}
      {storeData?.recentRatings && storeData.recentRatings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Customer Ratings</h2>
          <div className="space-y-4">
            {storeData.recentRatings.map((rating) => (
              <div
                key={rating.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {rating.user.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {rating.user.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-4">
                  {renderStars(rating.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;