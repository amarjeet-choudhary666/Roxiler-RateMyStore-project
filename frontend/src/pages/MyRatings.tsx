import React, { useState, useEffect } from 'react';
import { ratingAPI } from '../services/api';
import { StarIcon, PencilIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface Store {
  id: string;
  name: string;
  address: string;
}

interface Rating {
  id: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  store: Store;
}

const MyRatings: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRating, setEditingRating] = useState<string | null>(null);
  const [newRating, setNewRating] = useState<number>(0);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await ratingAPI.getUserRatings();
      const ratingsData = response.data?.data || response.data || [];
      setRatings(Array.isArray(ratingsData) ? ratingsData : []);
    } catch (error: any) {
      console.error('Failed to fetch ratings:', error);
      toast.error('Failed to fetch ratings');
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRating = async (ratingId: string, rating: number) => {
    try {
      const response = await ratingAPI.updateRating(ratingId, rating);
      const updatedRating = response.data?.data || response.data;

      setRatings(prev =>
        prev.map(r =>
          r.id === ratingId
            ? { ...r, rating, updatedAt: updatedRating.updatedAt || new Date().toISOString() }
            : r
        )
      );

      setEditingRating(null);
      setNewRating(0);
      toast.success('Rating updated successfully!');
    } catch (error: any) {
      console.error('Failed to update rating:', error);
      toast.error(error.response?.data?.message || 'Failed to update rating');
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate && onRate(star)}
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <StarSolidIcon
            className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
    </div>
  );

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getLastUpdatedDate = () => {
    if (ratings.length === 0) return 'Never';

    const latestUpdate = ratings.reduce((latest, rating) => {
      const date = new Date(rating.updatedAt || rating.createdAt);
      return date > latest ? date : latest;
    }, new Date(0));

    return formatDate(latestUpdate.toISOString());
  };

  const isRatingUpdated = (rating: Rating) => {
    const created = new Date(rating.createdAt).getTime();
    const updated = new Date(rating.updatedAt).getTime();
    return Math.abs(updated - created) > 1000;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <StarIcon className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your ratings...</p>
          <p className="text-sm text-gray-500">Please wait while we fetch your reviews</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="space-y-8 p-6">

        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">My Ratings ⭐</h1>
              <p className="text-blue-100 text-lg">Track and manage your store reviews</p>
            </div>
          </div>
          <div className="absolute top-4 right-4 opacity-20 flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="h-6 w-6 text-white" />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Ratings</p>
              <p className="text-2xl font-bold text-gray-900">{ratings.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <StarSolidIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {ratings.length > 0
                  ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <PencilIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-sm font-bold text-gray-900">{getLastUpdatedDate()}</p>
            </div>
          </div>
        </div>

        {/* Ratings List */}
        <div className="bg-white rounded-xl shadow-sm">
          {ratings.length === 0 ? (
            <div className="text-center py-12">
              <StarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No ratings yet</h3>
              <p className="mt-1 text-sm text-gray-500">Start rating stores to see them here.</p>
              <div className="mt-6">
                <a
                  href="/stores"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Stores
                </a>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {ratings.map((rating) => (
                <div key={rating.id} className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{rating.store.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{rating.store.address}</p>

                  {editingRating === rating.id ? (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update your rating:
                      </label>
                      {renderStars(newRating, true, setNewRating)}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleUpdateRating(rating.id, newRating)}
                          disabled={newRating === 0}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingRating(null);
                            setNewRating(0);
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      {renderStars(rating.rating)}
                      <button
                        onClick={() => {
                          setEditingRating(rating.id);
                          setNewRating(rating.rating);
                        }}
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-gray-500 space-y-1">
                    <p>
                      <span className="font-medium">Rated on:</span> {formatDate(rating.createdAt)}
                    </p>
                    {isRatingUpdated(rating) && (
                      <p className="text-blue-600">
                        <span className="font-medium">Last updated:</span> {formatDate(rating.updatedAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRatings;
