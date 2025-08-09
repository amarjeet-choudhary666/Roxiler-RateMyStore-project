import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { storeAPI, ratingAPI } from '../services/api';
import {
  BuildingStorefrontIcon,
  StarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface Store {
  id: string;
  name: string;
  address: string;
  averageRating: number;
  totalRatings: number;
}

interface Rating {
  id: string;
  rating: number;
  createdAt: string;
  store: {
    id: string;
    name: string;
    address: string;
  };
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [recentRatings, setRecentRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [storesResponse, ratingsResponse] = await Promise.all([
        storeAPI.getAllStores({ limit: 6 }),
        ratingAPI.getUserRatings(),
      ]);

      setStores(storesResponse.data.data.stores || []);
      setRecentRatings(ratingsResponse.data.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStores([]);
      setRecentRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/stores?search=${encodeURIComponent(searchQuery)}`;
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Discover amazing stores and share your experiences with the community.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Find Stores
        </h2>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stores by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BuildingStorefrontIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Stores</p>
              <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Ratings</p>
              <p className="text-2xl font-bold text-gray-900">{recentRatings?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <PlusIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Quick Action</p>
              <Link
                to="/stores"
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                Rate a Store →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Popular Stores
          </h2>
          <Link
            to="/stores"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores && stores.length > 0 ? stores.map((store) => (
            <div
              key={store.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 truncate">
                  {store.name}
                </h3>
                <div className="ml-2">
                  {renderStars(store.averageRating)}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {store.address}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {store.totalRatings} reviews
                </span>
                <Link
                  to={`/stores`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Rate Store
                </Link>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No stores available at the moment.
            </div>
          )}
        </div>
      </div>

      {recentRatings && recentRatings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              My Recent Ratings
            </h2>
            <Link
              to="/my-ratings"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-4">
            {recentRatings.map((rating) => (
              <div
                key={rating.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {rating.store.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {rating.store.address}
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

export default UserDashboard;